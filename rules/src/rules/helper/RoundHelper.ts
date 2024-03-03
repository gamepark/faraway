import { MaterialRulesPart } from '@gamepark/rules-api'
import { getValue } from '../../cards/Region'
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

  get turnOrder() {
    return this.regionCards
      .sort((item) => getValue(item.id))
      .getItems()
      .map((item) => item.location.player!)
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