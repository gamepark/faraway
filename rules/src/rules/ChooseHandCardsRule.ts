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

    const item = this.material(MaterialType.Region).getItem(move.itemIndex)
    const player = item.location.player
    // The hook may fire for moves whose source isn't owned by a player
    // (e.g. shuffles routed through the same rule, or items the framework
    // touches in passing); ignore those — endPlayerTurn(undefined) would
    // log a warning about "player undefined already inactive".
    if (player === undefined) return []
    if (this.getHand(player).length > 4) return []

    return [this.endPlayerTurn(player)]
  }

  getMovesAfterPlayersDone(): MaterialMove<number, number, number>[] {
    const moves: MaterialMove[] = []
    moves.push(this.material(MaterialType.Region).location(LocationType.RegionDeck).shuffle())
    moves.push(...this.drawRegionCardsMoves)
    moves.push(this.startSimultaneousRule(RuleId.PlaceRegion))
    return moves
  }

  get drawRegionCardsMoves() {
    return this.regionDeck.deal({
      type: LocationType.Region
    }, this.game.players.length + 1)
  }

  get regionDeck() {
    return this
      .material(MaterialType.Region)
      .location(LocationType.RegionDeck)
      .deck()
  }

  getHand(playerId: PlayerId) {
    return this
      .material(MaterialType.Region)
      .location(LocationType.PlayerRegionHand)
      .player(playerId)
  }
}