import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { SacrificeQuest } from '../cards/quests/SacrificeQuest'
import { Region } from '../cards/Region'
import { RegionQuests } from '../cards/RegionQuests'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

/**
 * Right-to-left, one tick per x position (x=7 first, x=0 last). Each tick:
 *  1. Reveal the cards at the current x (rotate them face-up).
 *  2. If any player owns an activatable SacrificeQuest at this x, hand off to
 *     SacrificeSanctuaryRule for that single x. SacrificeSanctuaryRule decrements
 *     CurrentScoringX and re-enters Scoring when its players are done.
 *  3. Otherwise, decrement CurrentScoringX and re-enter Scoring directly.
 *
 * When CurrentScoringX drops below 0, the loop terminates with endGame.
 */
export class ScoringRule extends MaterialRulesPart {
  onRuleStart() {
    // x is decremented HERE on every re-entry — not before startRule(Scoring) — so that
    // during the rule transition (while the StartRule animation holds the frame for the
    // tempo), `Memory.CurrentScoringX` still points to the JUST-resolved card. The UI
    // (panels' ScoringIndicator) shows that card's score during the wait, then the new
    // x kicks in here and reveals the next column.
    const previousX = this.remind<number | undefined>(Memory.CurrentScoringX)

    // Lock the score of every card at the JUST-resolved x before we advance to the
    // next one — at this point any SacrificeSanctuaryRule for that x has run, so the
    // game state reflects everything that should affect this card's score. Later
    // sacrifices on other x positions must NOT retroactively change it (the live
    // recomputation in consumers reads the current sanctuary set, which would shrink).
    if (previousX !== undefined && previousX >= 0) {
      this.lockScoresAtX(previousX)
    }

    const x = previousX === undefined ? 7 : previousX - 1
    this.memorize(Memory.CurrentScoringX, x)

    if (x < 0) {
      this.forget(Memory.CurrentScoringX)
      return [this.endGame()]
    }

    const moves: MaterialMove[] = []

    // Reveal cards at this x — only the ones HideRegionLine has flipped down. Sky cards
    // and digit-matched cards have stayed face-up (rotation: true) and must NOT be
    // rotated again, otherwise the framework emits a no-op move (or a double animation).
    moves.push(
      ...this.lineCards
        .location((location) => location.x === x && !location.rotation)
        .sort((item) => item.location.player!)
        .rotateItems(true)
    )

    const activeSacrificers = this.getEligibleSacrificersAtX(x)
    if (activeSacrificers.length > 0) {
      moves.push(this.startSimultaneousRule(RuleId.SacrificeSanctuary, activeSacrificers))
    } else {
      moves.push(this.startRule(RuleId.Scoring))
    }

    return moves
  }

  get lineCards() {
    return this.material(MaterialType.Region).location(LocationType.PlayerRegionLine)
  }

  /**
   * Capture every region card at `x` and write its final score into
   * {@link Memory.RegionScoresByIndex}. Called once `x` is fully resolved so the score
   * doesn't drift when later sacrifices change the visible sanctuary set.
   */
  private lockScoresAtX(x: number): void {
    const indexes = this.material(MaterialType.Region)
      .location(LocationType.PlayerRegionLine)
      .location(loc => loc.x === x)
      .getIndexes()
    if (indexes.length === 0) return
    this.memorize<Record<number, number>>(Memory.RegionScoresByIndex, prev => {
      const map = { ...(prev ?? {}) }
      for (const index of indexes) {
        const item = this.material(MaterialType.Region).getItem<Region>(index)
        if (item.location.player === undefined) continue
        const quest = RegionQuests[item.id]
        if (!quest) continue
        map[index] = quest.getTotalScore(this.game, index, MaterialType.Region, item.location.player as PlayerId)
      }
      return map
    })
  }

  /**
   * Players who own a SacrificeQuest region card at position `x` AND currently have
   * enough sanctuaries in their PlayerSanctuaryLine to pay for it.
   */
  private getEligibleSacrificersAtX(x: number): PlayerId[] {
    return this.game.players.filter(player => {
      const cardsAtX = this.material(MaterialType.Region)
        .location(LocationType.PlayerRegionLine)
        .player(player)
        .location(loc => loc.x === x)
        .getItems<Region>()
      if (cardsAtX.length === 0) return false
      const sanctuaryCount = this.material(MaterialType.Sanctuary)
        .location(LocationType.PlayerSanctuaryLine)
        .player(player)
        .length
      return cardsAtX.some(card => {
        const quest = RegionQuests[card.id as Region]
        return quest instanceof SacrificeQuest && sanctuaryCount >= quest.sanctuariesToSacrifice
      })
    })
  }
}
