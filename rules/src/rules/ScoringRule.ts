import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'

export class ScoringRule extends MaterialRulesPart {
  onRuleStart() {
    const moves: MaterialMove[] = []
    for (let i = 8; i > 0; i--) {
      moves.push(
        ...this.lineCards
          .location((location) => location.x === (i - 1))
          .sort((item) => item.location.player!)
          .rotateItems(true)
      )
    }
    moves.push(this.endGame())
    return moves
  }

  get lineCards() {
    return this.material(MaterialType.Region).location(LocationType.PlayerRegionLine)
  }
}