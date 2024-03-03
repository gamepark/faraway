import { MaterialDeck, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { getValue } from '../cards/Region'
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

    // TODO: compute sanctuary count
    const sanctuaryCount = 1
    return deck.deal({
      type: LocationType.PlayerSanctuaryHand,
      player: playerId,
    }, sanctuaryCount)
  }

  getCardValue(playerId: PlayerId) {
    return getValue(
      this.getPlayerCard(playerId)
      .location((location) => location.x === (this.round - 1))
      .getItem()!.id
    )
  }

  getPreviousCardValue(playerId: PlayerId) {
    return getValue(
      this.getPlayerCard(playerId)
        .location((location) => location.x === (this.round - 2))
        .getItem()!.id
    )
  }

  get sanctuaryDeck() {
    return this.material(MaterialType.Sanctuary).location(LocationType.SanctuaryDeck).deck()
  }

  getPlayerCard(playerId: PlayerId) {
    return this
      .material(MaterialType.Region)
      .location(LocationType.PlayerRegionLine)
      .player(playerId)
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }
}