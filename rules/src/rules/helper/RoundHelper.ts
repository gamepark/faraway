import { MaterialRulesPart } from '@gamepark/rules-api'
import { compareTime, Region } from '../../cards/Region'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { Memory } from '../Memory'

export class RoundHelper extends MaterialRulesPart {



  get regionCards() {
    return this
      .material(MaterialType.Region)
      .location((location) => LocationType.PlayerRegionLine === location.type && location.x === (this.round - 1))
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }

  // Sort by exploration time ascending; Starry Skies cards break ties by being treated as higher.
  get turnOrder() {
    return this.regionCards
      .getItems<Region>()
      .slice()
      .sort((a, b) => compareTime(a.id, b.id))
      .map(item => item.location.player!)
  }


  get firstPlayer() {
    return this.turnOrder[0]
  }

  getNextPlayer(playerId: PlayerId) {
    const index = this.turnOrder.indexOf(playerId)
    if (index === (this.game.players.length - 1)) return
    return this.turnOrder[this.turnOrder.indexOf(playerId) + 1]
  }
}