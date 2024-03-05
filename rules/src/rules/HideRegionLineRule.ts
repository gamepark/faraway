import { CustomMove, isCustomMoveType, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'

export class ScoringRule extends MaterialRulesPart {
  onRuleStart() {
    const moves: MaterialMove[] = []
    moves.push(this.lineCards.moveItemsAtOnce({ rotation: false }))
    moves.push(... Array.from(Array(8)).map((_, index) => this.rules().customMove(CustomMoveType.ScoreCard, 8 - index)))
    return moves
  }

  get lineCards() {
    return this.material(MaterialType.Region).location(LocationType.PlayerRegionLine)
  }

  onCustomMove(move: CustomMove) {
    if (!isCustomMoveType(CustomMoveType.ScoreCard)(move)) return []
    const moves: MaterialMove[] = []
    const roundCards = this.material(MaterialType.Region).location((location) => location.type === LocationType.PlayerRegionLine && location.x === move.data - 1)
    moves.push(...roundCards.rotateItems(true))

    if (move.data === 1) moves.push(this.rules().endGame())
    return moves
  }


}