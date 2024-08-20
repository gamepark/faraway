import { MaterialRulesPart } from '@gamepark/rules-api'
import { RoundHelper } from './helper/RoundHelper'
import { RuleId } from './RuleId'

export class RevealRegionCards extends MaterialRulesPart {
  onRuleStart() {
    return [
      ...this.hiddenRegionCards.rotateItems(true),
      this.startRule(RuleId.DealSanctuaries)
    ]
  }

  get hiddenRegionCards() {
    return new RoundHelper(this.game).regionCards
      .rotation((rotation) => rotation === undefined)
  }
}