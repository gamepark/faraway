import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class HideRegionLineRule extends MaterialRulesPart {
  onRuleStart() {
    const moves: MaterialMove[] = []
    moves.push(this.lineCards.moveItemsAtOnce({ rotation: false }))
    moves.push(this.startRule(RuleId.Scoring))
    return moves
  }

  get lineCards() {
    return this.material(MaterialType.Region).location(LocationType.PlayerRegionLine)
  }
}