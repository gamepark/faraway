import { isMoveItemType, isShuffle, ItemMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class ChooseNewRegionCardRule extends PlayerTurnRule {

  onRuleStart() {
    if (!this.getPlayerMoves().length) return [this.startRule(RuleId.PlaceSanctuary)]
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

    // Shuffle hand after changing the rule in order to prevent game from highlighting
    return [
      this.startRule(RuleId.PlaceSanctuary),
      this.hand.shuffle(),
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