import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { countCriterion } from '../../cards/CardCounting'
import { getAttachedSpirits, getVisibleRegions } from '../../cards/quests/Quest'
import { compareTime, Region } from '../../cards/Region'
import { Sanctuary } from '../../cards/Sanctuary'
import { Spirit } from '../../cards/Spirit'
import { Spirits } from '../../cards/Spirits'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { Memory } from '../Memory'

/**
 * Beyond the Veil extension helpers.
 */
export class SpiritHelper extends MaterialRulesPart {

  get isActive() {
    return !!this.game.items[MaterialType.Spirit]?.length
  }

  get availableSpirits() {
    return this.material(MaterialType.Spirit).location(LocationType.AvailableSpirit)
  }

  /**
   * The cards of a player during the game: all their Region and Sanctuary cards, and the Spirits under their Regions.
   * A Spirit and its Region are one card: its resources count right away.
   */
  getPlayerCards(player: PlayerId) {
    return {
      regions: this.material(MaterialType.Region).location(LocationType.PlayerRegionLine).player(player).getItems<Region>(),
      sanctuaries: this.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryLine).player(player).getItems<Sanctuary>(),
      spirits: this.material(MaterialType.Spirit).location(LocationType.PlayerSpirit).player(player).getItems<Spirit>()
    }
  }

  /**
   * How many of the acquisition criterion of a Spirit a player has.
   */
  getConditionCount(spirit: Spirit, player: PlayerId) {
    return countCriterion(Spirits[spirit].condition.criterion, this.getPlayerCards(player))
  }

  /**
   * A player can take an available Spirit if they satisfy its conditions, and if one of the cards played this turn is part of the
   * conditions: the Region card of this round, or the Sanctuary placed this turn. This covers the rule for the players who already
   * satisfied the conditions when the Spirit came into play, without having to remember anything.
   */
  canTake(spiritIndex: number, player: PlayerId) {
    const spirit = this.material(MaterialType.Spirit).getItem<Spirit>(spiritIndex).id
    return this.getConditionCount(spirit, player) >= Spirits[spirit].condition.count && this.playedMatchingCardThisTurn(spirit, player)
  }

  /**
   * True when the player satisfies the conditions of an available Spirit, but did not play any card part of them this turn.
   */
  isBlocked(spiritIndex: number, player: PlayerId) {
    const spirit = this.material(MaterialType.Spirit).getItem<Spirit>(spiritIndex).id
    return this.getConditionCount(spirit, player) >= Spirits[spirit].condition.count && !this.playedMatchingCardThisTurn(spirit, player)
  }

  playedMatchingCardThisTurn(spirit: Spirit, player: PlayerId) {
    const { criterion } = Spirits[spirit].condition
    const round = this.remind<number>(Memory.Round)
    const regions = this.material(MaterialType.Region).location(LocationType.PlayerRegionLine).player(player)
    const region = regions.location(location => location.x === round - 1).getItem<Region>()
    if (region && countCriterion(criterion, { regions: [region], sanctuaries: [] }) > 0) return true
    // A Sanctuary is placed when the exploration time is greater than the previous round's one
    const previous = regions.location(location => location.x === round - 2).getItem<Region>()
    if (!region || !previous || compareTime(region.id, previous.id) <= 0) return false
    const sanctuary = this.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryLine).player(player)
      .maxBy(item => item.location.x!).getItem<Sanctuary>()
    return !!sanctuary && countCriterion(criterion, { regions: [], sanctuaries: [sanctuary] }) > 0
  }

  /**
   * Moves to place new Spirits so that 2 of them are available, starting with the one already visible on top of the deck,
   * then reveal the new top card of the deck.
   * Only indexes are used: the ids of the cards in the deck are hidden.
   */
  get refillMoves() {
    const missing = 2 - this.availableSpirits.length
    if (missing <= 0) return []
    const deckIndexes = this.material(MaterialType.Spirit).location(LocationType.SpiritDeck)
      .sort(item => -item.location.x!)
      .getIndexes()
    const drawn = deckIndexes.slice(0, missing)
    const moves = drawn.map(index => this.material(MaterialType.Spirit).index(index).moveItem({ type: LocationType.AvailableSpirit }))
    if (deckIndexes.length > drawn.length) {
      moves.push(this.material(MaterialType.Spirit).index(deckIndexes[drawn.length]).rotateItem(true))
    }
    return moves
  }
}

/**
 * Score of a Spirit placed under a Region card. A Spirit scores along with its Region: the same cards are visible at that moment.
 */
export const getSpiritQuestScore = (game: MaterialGame, spiritIndex: number): number => {
  const helper = new SpiritHelper(game)
  const item = helper.material(MaterialType.Spirit).getItem<Spirit>(spiritIndex)
  if (item.location.type !== LocationType.PlayerSpirit || item.id === undefined) return 0
  const { points = 0, bonus } = Spirits[item.id]
  if (!bonus) return points
  const player = item.location.player!
  const regions = getVisibleRegions(game, player, item.location.x)
  const sanctuaries = helper.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryLine).player(player).getItems<Sanctuary>()
  const spirits = getAttachedSpirits(game, player, regions)
  return points + bonus.points * countCriterion(bonus.criterion, { regions, sanctuaries, spirits })
}
