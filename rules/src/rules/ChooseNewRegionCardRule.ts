import { isMoveItemType, ItemMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class ChooseNewRegionCardRule extends PlayerTurnRule {
  getPlayerMoves() {
    return this.regions
      .moveItems({
        type: LocationType.PlayerRegionHand,
        player: this.player
      })
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Region)(move)) return []
    return [this.rules().startRule(RuleId.PlaceSanctuary)]
  }

  get regions() {
    return this.material(MaterialType.Region)
      .location(LocationType.Region)
  }
}