import { MaterialDeck, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { getValue } from '../cards/Region'
import { Regions } from '../cards/Regions'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { RoundHelper } from './helper/RoundHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import sum from 'lodash/sum'

export class DealSanctuariesRule extends MaterialRulesPart {
  onRuleStart() {
    const round = this.round
    const moves: MaterialMove[] = []
    if (round > 1) {
      const deck = this.sanctuaryDeck
      for (const player of new RoundHelper(this.game).turnOrder) {
        moves.push(...this.getPlayerSanctuaries(deck, player))
      }
    }

    moves.push(this.rules().startPlayerTurn(RuleId.ChooseNewRegion, new RoundHelper(this.game).firstPlayer))
    return moves
  }

  getPlayerSanctuaries(deck: MaterialDeck, playerId: PlayerId) {
    const drawSanctuary = this.getCardValue(playerId) > this.getPreviousCardValue(playerId)
    if (!drawSanctuary) return []
    const regionClues = sum(this
      .getPlayerRegionCards(playerId)
      .getItems().map((item) => Regions[item.id].clue ?? 0))
    console.log(regionClues)
    // TODO: count sanctuary clues
    const sanctuariesClues = 0
    const sanctuaryCount = 1 + regionClues + sanctuariesClues
    return deck.deal({
      type: LocationType.PlayerSanctuaryHand,
      player: playerId,
    }, sanctuaryCount)
  }

  getCardValue(playerId: PlayerId) {
    return getValue(
      this.getPlayerRegionCards(playerId)
      .location((location) => location.x === (this.round - 1))
      .getItem()!.id
    )
  }

  getPreviousCardValue(playerId: PlayerId) {
    return getValue(
      this.getPlayerRegionCards(playerId)
        .location((location) => location.x === (this.round - 2))
        .getItem()!.id
    )
  }

  get sanctuaryDeck() {
    return this.material(MaterialType.Sanctuary).location(LocationType.SanctuaryDeck).deck()
  }

  getPlayerRegionCards(playerId: PlayerId) {
    return this
      .material(MaterialType.Region)
      .location(LocationType.PlayerRegionLine)
      .player(playerId)
  }

  getPlayerSanctuaryCards(playerId: PlayerId) {
    return this
      .material(MaterialType.Sanctuary)
      .location(LocationType.PlayerSanctuaryLine)
      .player(playerId)
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }
}