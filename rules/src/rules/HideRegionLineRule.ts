import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Region, stayedVisible } from '../cards/Region'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class HideRegionLineRule extends MaterialRulesPart {
  onRuleStart() {
    const moves: MaterialMove[] = []

    // Per player: flip only the cards that should NOT stay visible at end-of-game.
    // Starry Skies cards always stay visible; cards whose ones digit matches a Starry Skies
    // card's ones digit (in the same player's tableau) also stay visible.
    for (const player of this.game.players) {
      const playerLine = this.material(MaterialType.Region)
        .location(LocationType.PlayerRegionLine)
        .player(player)
      const playerCardIds = playerLine.getItems<Region>().map(item => item.id as Region)
      const cardsToHide = playerLine.filter(item => !stayedVisible(item.id as Region, playerCardIds))
      if (cardsToHide.length > 0) {
        moves.push(cardsToHide.moveItemsAtOnce({ rotation: false }))
      }
    }

    moves.push(this.startRule(RuleId.Scoring))
    return moves
  }
}