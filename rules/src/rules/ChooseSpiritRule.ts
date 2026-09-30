import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { CustomMoveType } from './CustomMoveType'
import { RoundHelper } from './helper/RoundHelper'
import { SpiritHelper } from './helper/SpiritHelper'
import { Memory } from './Memory'

/**
 * Beyond the Veil extension: at the end of their exploration, a player who satisfies the acquisition conditions of an available
 * Spirit may take it, and slide it under the Region card they played this round. Only 1 Spirit per turn.
 */
export class ChooseSpiritRule extends PlayerTurnRule<PlayerId, MaterialType, LocationType> {
  onRuleStart() {
    if (!this.spiritsToTake.length) return new RoundHelper(this.game).goToNextPlayerMoves(this.player)
    return []
  }

  getPlayerMoves() {
    const region = this.material(MaterialType.Region).location(LocationType.PlayerRegionLine).player(this.player)
      .location(location => location.x === this.round - 1)
    const regionIndex = region.getIndex()
    return [
      ...this.spiritsToTake.moveItems({ type: LocationType.PlayerSpirit, player: this.player, parent: regionIndex, x: this.round - 1 }),
      this.customMove(CustomMoveType.Pass)
    ]
  }

  get spiritsToTake() {
    const helper = new SpiritHelper(this.game)
    return helper.availableSpirits.index(index => helper.canTake(index, this.player))
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Spirit)(move) || move.location.type !== LocationType.PlayerSpirit) return []
    return new RoundHelper(this.game).goToNextPlayerMoves(this.player)
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (!isCustomMoveType(CustomMoveType.Pass)(move)) return []
    return new RoundHelper(this.game).goToNextPlayerMoves(this.player)
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }
}
