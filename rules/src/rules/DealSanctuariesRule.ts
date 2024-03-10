import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RoundHelper } from './helper/RoundHelper'
import { SanctuaryHelper } from './helper/SanctuaryHelper'
import { RuleId } from './RuleId'

export class DealSanctuariesRule extends MaterialRulesPart {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const deck = this.sanctuaryDeck
    for (const player of new RoundHelper(this.game).turnOrder) {
      moves.push(...new SanctuaryHelper(this.game, deck, player).sanctuariesToDrawn)
    }

    moves.push(this.rules().startPlayerTurn(RuleId.ChooseNewRegion, new RoundHelper(this.game).firstPlayer))
    return moves
  }

  get sanctuaryDeck() {
    return this.material(MaterialType.Sanctuary).location(LocationType.SanctuaryDeck).deck()
  }
}