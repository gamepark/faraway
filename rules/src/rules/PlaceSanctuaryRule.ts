import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RoundHelper } from './helper/RoundHelper'
import { SanctuaryHelper } from './helper/SanctuaryHelper'
import { SpiritHelper } from './helper/SpiritHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlaceSanctuaryRule extends PlayerTurnRule {

  onRuleStart() {
    const drawnSanctuaries = new SanctuaryHelper(this.game, this.sanctuaryDeck, this.player).sanctuariesToDrawn
    if (drawnSanctuaries.length) return drawnSanctuaries
    if (!this.hand.length) return this.goToNextRule()
    return []
  }

  getPlayerMoves() {
    return this.hand.moveItems({
      type: LocationType.PlayerSanctuaryLine,
      player: this.player
    })
  }

  get sanctuaryDeck() {
    return this.material(MaterialType.Sanctuary).location(LocationType.SanctuaryDeck).deck()
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Sanctuary)(move)
      || move.location.type === LocationType.SanctuaryDeck
      || move.location.type === LocationType.PlayerSanctuaryHand
    ) return []
    const moves: MaterialMove[] = []

    moves.push(...this.discardHand())
    moves.push(...this.goToNextRule())
    return moves
  }

  goToNextRule() {
    if (new SpiritHelper(this.game).isActive) return [this.startPlayerTurn(RuleId.ChooseSpirit, this.player)]
    return new RoundHelper(this.game).goToNextPlayerMoves(this.player)
  }

  discardHand() {
    return this.hand.moveItems({
      type: LocationType.SanctuaryDeck,
      x: 0
    })
  }

  get hand() {
    return this.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryHand).player(this.player)
  }
}