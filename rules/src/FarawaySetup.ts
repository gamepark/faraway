import { MaterialGameSetup } from '@gamepark/rules-api'
import { regions } from './cards/Region'
import { sanctuaries } from './cards/Sanctuary'
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
    this.setupRegions()
    this.setupSanctuaries()
    this.setupPlayers(options)
    const deck = this.material(MaterialType.Region).location(LocationType.RegionDeck).deck()

    deck.deal({ type: LocationType.Region }, options.players + 1)
    this.memorize(Memory.Round, 1)
  }

  setupPlayers(options: FarawayOptions) {
    const deck = this.material(MaterialType.Region).deck()
    for (let index = 0; index < options.players; index++) {
      deck.deal({ type: LocationType.PlayerRegionHand, player: index + 1 }, 3)
    }
  }

  setupRegions() {
    const cards = regions.map((region) => ({
      id: region,
      location: {
        type: LocationType.RegionDeck
      }
    }))

    this.material(MaterialType.Region).createItems(cards)
    this.material(MaterialType.Region).shuffle()
  }

  setupSanctuaries() {
    const cards = sanctuaries.map((sanctuary) => ({
      id: sanctuary,
      location: {
        type: LocationType.SanctuaryDeck
      }
    }))

    this.material(MaterialType.Sanctuary).createItems(cards)
    this.material(MaterialType.Sanctuary).shuffle()
  }

  start() {
    this.startSimultaneousRule(RuleId.PlaceRegion)
  }
}