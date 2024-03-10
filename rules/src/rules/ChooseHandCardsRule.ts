import { isMoveItemType, ItemMove, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { RuleId } from './RuleId'

export class ChooseHandCardsRule extends SimultaneousRule {
  getActivePlayerLegalMoves(playerId: number) {
    const hand = this.getHand(playerId)
    return hand.moveItems({
      type: LocationType.RegionDeck
    })
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Region)(move)) return []

    const item = this.material(MaterialType.Region).getItem(move.itemIndex)!
    const player = item.location.player!
    if (this.getHand(player).length > 4) return []

    return [this.rules().endPlayerTurn(player)]
  }

  getMovesAfterPlayersDone(): MaterialMove<number, number, number>[] {
    const moves: MaterialMove[] = []
    moves.push(this.material(MaterialType.Region).location(LocationType.RegionDeck).shuffle())
    moves.push(this.rules().startSimultaneousRule(RuleId.PlaceRegion))
    return moves
  }

  getHand(playerId: PlayerId) {
    return this
      .material(MaterialType.Region)
      .location(LocationType.PlayerRegionHand)
      .player(playerId)
  }
}