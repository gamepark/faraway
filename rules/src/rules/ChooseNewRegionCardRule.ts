import { isMoveItemType, isShuffle, ItemMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class ChooseNewRegionCardRule extends PlayerTurnRule {

  onRuleStart() {
    if (!this.getPlayerMoves().length) return [this.rules().startRule(RuleId.PlaceSanctuary)]
    return []
  }
  getPlayerMoves() {
    return this.regions
      .moveItems({
        type: LocationType.PlayerRegionHand,
        player: this.player
      })
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Region)(move)) return []
    if (isShuffle(move)) return []

    return [
      this.hand.shuffle(),
      this.rules().startRule(RuleId.PlaceSanctuary)
    ]
  }

  get hand() {
    return this.material(MaterialType.Region).location(LocationType.PlayerRegionHand).player(this.player)
  }

  get regions() {
    return this.material(MaterialType.Region)
      .location(LocationType.Region)
  }
}