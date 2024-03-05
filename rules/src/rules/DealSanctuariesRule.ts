import { MaterialDeck, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import sum from 'lodash/sum'
import { getValue } from '../cards/Region'
import { Regions } from '../cards/Regions'
import { Sanctuaries } from '../cards/Sanctuaries'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { RoundHelper } from './helper/RoundHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

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
    const sanctuaryCount = this.getClues(playerId)
    return deck.deal({
      type: LocationType.PlayerSanctuaryHand,
      player: playerId
    }, sanctuaryCount)
  }

  getClues(playerId: PlayerId) {
    const regionClues = sum(
      this
        .getPlayerRegionCards(playerId)
        .getItems().map((item) => Regions[item.id]?.clue ?? 0)
    )

    const sanctuaryClues = sum(
      this
        .getPlayerSanctuaryCards(playerId)
        .getItems().map((item) => Sanctuaries[item.id]?.clue ?? 0)
    )

    return 1 + regionClues + sanctuaryClues
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