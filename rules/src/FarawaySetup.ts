import { MaterialGameSetup } from '@gamepark/rules-api'
import { baseGameRegions, regions } from './cards/Region'
import { baseGameSanctuaries, sanctuaries } from './cards/Sanctuary'
import { FarawayOptions } from './FarawayOptions'
import { FarawayRules } from './FarawayRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { Memory } from './rules/Memory'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class FarawaySetup extends MaterialGameSetup<PlayerId, MaterialType, LocationType, FarawayOptions> {
  Rules = FarawayRules

  setupMaterial(options: FarawayOptions) {
    this.setupRegions(options)
    this.setupSanctuaries(options)
    this.setupPlayers(options)
    this.setupAvailableRegions(options)
    this.memorize(Memory.Round, 1)
  }

  setupRegions(options: FarawayOptions) {
    const playedRegions = options.expansion1 ? regions : baseGameRegions
    const cards = playedRegions.map(region => ({
      id: region,
      location: {
        type: LocationType.RegionDeck
      }
    }))

    this.material(MaterialType.Region).createItems(cards)
    this.material(MaterialType.Region).shuffle()
  }

  setupSanctuaries(options: FarawayOptions) {
    const playedSanctuaries = options.expansion1 ? sanctuaries : baseGameSanctuaries
    const cards = playedSanctuaries.map((sanctuary) => ({
      id: sanctuary,
      location: {
        type: LocationType.SanctuaryDeck
      }
    }))

    this.material(MaterialType.Sanctuary).createItems(cards)
    this.material(MaterialType.Sanctuary).shuffle()
  }

  setupPlayers(options: FarawayOptions) {
    const deck = this.material(MaterialType.Region).deck()
    for (const player of this.players) {
      deck.deal({ type: LocationType.PlayerRegionHand, player }, options.beginner ? 3 : 5)
    }
  }

  setupAvailableRegions(options: FarawayOptions) {
    if (!options.beginner) return
    const deck = this.material(MaterialType.Region).location(LocationType.RegionDeck).deck()
    deck.deal({ type: LocationType.Region }, options.players + 1)
  }

  start(options: FarawayOptions) {
    if (options.beginner) {
      this.startSimultaneousRule(RuleId.PlaceRegion)
    } else {
      this.startSimultaneousRule(RuleId.ChooseHandCards)
    }
  }
}