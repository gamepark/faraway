import { isMoveItemType, ItemMove, MaterialRulesPart } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { RoundHelper } from './helper/RoundHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class RevealRegionCards extends MaterialRulesPart {
  onRuleStart() {
    return this.hiddenRegionCards.rotateItems(true)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Region)(move) || !move.location.rotation) return []
    const remainingCards = this.hiddenRegionCards.length
    if (remainingCards) return []
    return [this.rules().startRule(RuleId.DealSanctuaries)]

  }

  get hiddenRegionCards() {
    return new RoundHelper(this.game).regionCards
      .rotation((rotation) => rotation === undefined)
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }
}