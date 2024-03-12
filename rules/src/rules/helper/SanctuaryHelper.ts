import { MaterialDeck, MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import sum from 'lodash/sum'
import { getValue } from '../../cards/Region'
import { Regions } from '../../cards/Regions'
import { Sanctuaries } from '../../cards/Sanctuaries'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { Memory } from '../Memory'

export class SanctuaryHelper extends MaterialRulesPart {

  constructor(game: MaterialGame, readonly deck: MaterialDeck, readonly player: PlayerId) {
    super(game)
  }

  get sanctuariesToDrawn() {
    if (this.round === 1) return []
    const drawSanctuary = this.cardValue > this.previousCardValue
    if (!drawSanctuary) return []
    const hand = this.hand
    const totalSanctuaries = this.clues
    const sanctuaryCount = Math.min(totalSanctuaries - hand.length, totalSanctuaries)

    return this.deck.deal({
      type: LocationType.PlayerSanctuaryHand,
      player: this.player
    }, sanctuaryCount)
  }

  get clues() {
    const regionClues = sum(
      this
        .regionCards
        .getItems().map((item) => Regions[item.id]?.clue ?? 0)
    )

    const sanctuaryClues = sum(
      this
        .sanctuaryCards
        .getItems().map((item) => Sanctuaries[item.id]?.clue ?? 0)
    )

    return 1 + regionClues + sanctuaryClues
  }

  get cardValue() {
    return getValue(
      this.regionCards
        .location((location) => location.x === (this.round - 1))
        .getItem()!.id
    )
  }

  get previousCardValue() {
    return getValue(
      this.regionCards
        .location((location) => location.x === (this.round - 2))
        .getItem()!.id
    )
  }

  get regionCards() {
    return this
      .material(MaterialType.Region)
      .location(LocationType.PlayerRegionLine)
      .player(this.player)
  }

  get sanctuaryCards() {
    return this
      .material(MaterialType.Sanctuary)
      .location(LocationType.PlayerSanctuaryLine)
      .player(this.player)
  }

  get round() {
    return this.remind<number>(Memory.Round)
  }

  get hand() {
    return this.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryHand).player(this.player)
  }
}