import { isMoveItemType, ItemMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlaceRegionRule extends SimultaneousRule<PlayerId, MaterialType, LocationType> {
  getActivePlayerLegalMoves(playerId: PlayerId) {
    return this.getHand(playerId).moveItems({
      type: LocationType.PlayerRegionLine,
      player: playerId,
      x: (this.round - 1)
    })
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Region)(move)) return []
    return [this.endPlayerTurn(move.location.player!)]
  }

  getMovesAfterPlayersDone(): MaterialMove<PlayerId, MaterialType, LocationType>[] {
    return [this.startRule(RuleId.RevealRegions)]
  }

  getHand(playerId: PlayerId) {
    return this.material(MaterialType.Region).location(LocationType.PlayerRegionHand).player(playerId)
  }
}