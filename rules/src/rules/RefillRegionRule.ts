import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class RefillRegionRule extends MaterialRulesPart {
  onRuleStart() {
    const moves: MaterialMove[] = []

    moves.push(...this.discardRegionCardsMoves)

    if (this.round < 7) {
      moves.push(...this.drawRegionCardsMoves)
    }

    moves.push(this.rules().startSimultaneousRule(RuleId.PlaceRegion))
    return moves
  }

  get discardRegionCardsMoves() {
    return this.regions.moveItems({ type: LocationType.RegionDiscard })
  }

  get drawRegionCardsMoves() {
    return this.regionDeck.deal({
      type: LocationType.Region
    }, this.game.players.length + 1)
  }

  get regionDeck() {
    return this
      .material(MaterialType.Region)
      .location(LocationType.RegionDeck)
      .deck()
  }

  get regions() {
    return this
      .material(MaterialType.Region)
      .location(LocationType.Region)
  }

  onRuleEnd() {
    this.memorize(Memory.Round, (round) => round + 1)
    return []
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }
}