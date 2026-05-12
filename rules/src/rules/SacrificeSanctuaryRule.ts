import { EndPlayerTurn, MaterialMove, PlayMoveContext, SimultaneousRule } from '@gamepark/rules-api'
import { SacrificeQuest } from '../cards/quests/SacrificeQuest'
import { Region } from '../cards/Region'
import { RegionQuests } from '../cards/RegionQuests'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

/**
 * Tick-scoped sacrifice step. Started by ScoringRule when at least one player owns
 * an activatable SacrificeQuest at the current x position (Memory.CurrentScoringX).
 * Active players are filtered upstream by ScoringRule.getEligibleSacrificersAtX —
 * we trust they each have a SacrificeQuest here AND enough sanctuaries to pay it.
 *
 * Each active player can:
 *  - Move sanctuaries from their line to the SanctuaryDeck (the deck's
 *    PositiveSequenceStrategy assigns each item's x automatically — we don't set it).
 *  - {@link endPlayerTurn} to commit.
 *
 * Whether the SacrificeQuest scored is decided by SacrificeQuest.getTotalScore, which
 * reads Memory.SacrificesByX[x][player] (written here at endPlayerTurn) and compares
 * to the quest's `sanctuariesToSacrifice`. The cost lives on the quest, not in the rule.
 */
export class SacrificeSanctuaryRule extends SimultaneousRule<PlayerId, MaterialType, LocationType> {

  override onRuleStart(): MaterialMove[] {
    // Snapshot each active player's sanctuary-line size now, so that when they end
    // their turn we can compute how many sanctuaries they sacrificed during this tick.
    const baseline: Record<PlayerId, number> = {}
    for (const player of this.activePlayers) {
      baseline[player] = this.sanctuaryLine(player).length
    }
    this.memorize(Memory.SacrificeBaseline, baseline)
    return []
  }

  getActivePlayerLegalMoves(player: PlayerId): MaterialMove[] {
    const baseline = this.remind<Record<PlayerId, number>>(Memory.SacrificeBaseline)
    const sacrificed = (baseline?.[player] ?? 0) - this.sanctuaryLine(player).length
    const cost = this.sacrificeCost(player)
    const moves: MaterialMove[] = []

    // Sanctuary moves are listed only while the player has cost left to pay — once
    // they've paid in full there's no point throwing more away.
    if (sacrificed < cost) {
      moves.push(...this.sanctuaryLine(player).moveItems({ type: LocationType.SanctuaryDeck }))
    }

    // endPlayerTurn is only legal at clean boundaries: before any sacrifice (decline)
    // or after the cost is fully paid (commit). A partial sacrifice cannot be committed.
    if (sacrificed === 0 || sacrificed >= cost) {
      moves.push(this.endPlayerTurn(player))
    }

    return moves
  }

  /**
   * Cost of the SacrificeQuest at the current x for this player. Trusts ScoringRule's
   * upstream filter — active players are guaranteed to have a SacrificeQuest here AND
   * enough sanctuaries to pay for it. Returns 0 only as a defensive fallback.
   */
  private sacrificeCost(player: PlayerId): number {
    const x = this.remind<number>(Memory.CurrentScoringX)
    const card = this.material(MaterialType.Region)
      .location(LocationType.PlayerRegionLine)
      .player(player)
      .location(loc => loc.x === x)
      .getItem<Region>()
    if (!card) return 0
    const quest = RegionQuests[card.id]
    return quest instanceof SacrificeQuest ? quest.sanctuariesToSacrifice : 0
  }

  override onPlayerTurnEnd(move: EndPlayerTurn<PlayerId>, _context?: PlayMoveContext): MaterialMove[] {
    const player = move.player
    const baseline = this.remind<Record<PlayerId, number>>(Memory.SacrificeBaseline)
    const sacrificed = (baseline?.[player] ?? 0) - this.sanctuaryLine(player).length
    if (sacrificed > 0) {
      const x = this.remind<number>(Memory.CurrentScoringX)
      this.memorize<Record<number, Record<PlayerId, number>>>(Memory.SacrificesByX, prev => {
        const map = { ...(prev ?? {}) }
        map[x] = { ...(map[x] ?? {}), [player]: sacrificed }
        return map
      })
    }
    return []
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    // No decrement here — ScoringRule.onRuleStart owns the x lifecycle. We just clean
    // up the per-tick baseline and hand control back so the rule transition's tempo
    // can show the just-resolved card's score on the panels.
    this.forget(Memory.SacrificeBaseline)
    return [this.startRule(RuleId.Scoring)]
  }

  private sanctuaryLine(player: PlayerId) {
    return this.material(MaterialType.Sanctuary)
      .location(LocationType.PlayerSanctuaryLine)
      .player(player)
  }
}
