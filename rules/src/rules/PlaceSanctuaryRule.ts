import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RoundHelper } from './helper/RoundHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlaceSanctuaryRule extends PlayerTurnRule {

  onRuleStart() {
    if (!this.hand.length) return this.goToNextRule()
    return []
  }
  getPlayerMoves() {
    return this.hand.moveItems({
      type: LocationType.PlayerSanctuaryLine,
      player: this.player
    })
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Sanctuary)(move) || move.location.type === LocationType.SanctuaryDeck) return []
    const moves: MaterialMove[] = []

    moves.push(...this.discardHand())
    moves.push(...this.goToNextRule())
    return moves
  }

  goToNextRule() {
    const nextPlayer = new RoundHelper(this.game).getNextPlayer(this.player)
    if (!nextPlayer) {
      if (this.round === 8) return [this.rules().startRule(RuleId.HideRegionLine)]
      return [this.rules().startRule(RuleId.RefillRegion)]
    }

    return [this.rules().startPlayerTurn(RuleId.ChooseNewRegion, nextPlayer)]
  }

  discardHand() {
    return this.hand.moveItems({
      type: LocationType.SanctuaryDeck
    })
  }

  get hand() {
    return this.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryHand).player(this.player)
  }
}