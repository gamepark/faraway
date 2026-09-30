import { MaterialRulesPart } from '@gamepark/rules-api'
import { compareTime, Region } from '../../cards/Region'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

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

  /**
   * Moves to play once a player has ended their exploration: next player, or end of the round.
   */
  goToNextPlayerMoves(playerId: PlayerId) {
    const nextPlayer = this.getNextPlayer(playerId)
    if (!nextPlayer) {
      if (this.round === 8) return [this.startRule(RuleId.HideRegionLine)]
      return [this.startRule(RuleId.RefillRegion)]
    }
    return [this.startPlayerTurn(RuleId.ChooseNewRegion, nextPlayer)]
  }

  getNextPlayer(playerId: PlayerId) {
    const index = this.turnOrder.indexOf(playerId)
    if (index === (this.game.players.length - 1)) return
    return this.turnOrder[this.turnOrder.indexOf(playerId) + 1]
  }
}