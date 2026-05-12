import { MaterialDeck, MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { sum } from 'es-toolkit/compat'
import { compareTime, Region } from '../../cards/Region'
import { Regions } from '../../cards/Regions'
import { Sanctuaries } from '../../cards/Sanctuaries'
import { Sanctuary } from '../../cards/Sanctuary'
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
    // Starry Skies: on tied exploration times, the meteor card is treated as higher,
    // so playing a meteor with the same time as the previous round still triggers a draw.
    const drawSanctuary = compareTime(this.currentCard, this.previousCard) > 0
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
        .getItems<Region>().map((item) => Regions[item.id]?.clue ?? 0)
    )

    const sanctuaryClues = sum(
      this
        .sanctuaryCards
        .getItems<Sanctuary>().map((item) => Sanctuaries[item.id]?.clue ?? 0)
    )

    return 1 + regionClues + sanctuaryClues
  }

  get currentCard(): Region {
    return this.regionCards
      .location((location) => location.x === (this.round - 1))
      .getItem<Region>()!.id
  }

  get previousCard(): Region {
    return this.regionCards
      .location((location) => location.x === (this.round - 2))
      .getItem<Region>()!.id
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