import { MaterialGameSetup } from '@gamepark/rules-api'
import { regions } from './cards/Region'
import { sanctuaries } from './cards/Sanctuary'
import { FarawayOptions } from './FarawayOptions'
import { FarawayRules } from './FarawayRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
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
    const deck = this.material(MaterialType.RegionCard).location(LocationType.RegionDeck).deck()
    const sanctuaryDeck = this.material(MaterialType.SanctuaryCard).location(LocationType.SanctuaryDeck).deck()
    for (let index = 0; index < options.players; index++) {
      deck.deal({ type: LocationType.PlayerRegion, player: index }, 8)
      sanctuaryDeck.deal({ type: LocationType.PlayerSanctuary, player: index }, 7)
    }

    deck.deal({ type: LocationType.Region }, 3)
  }

  setupPlayers(options: FarawayOptions) {
    const deck = this.material(MaterialType.RegionCard).deck()
    for (let index = 0; index < options.players; index++) {
      deck.deal({ type: LocationType.RegionHand, player: index + 1 }, 3)
    }
  }

  setupRegions() {
    const cards = regions.map((region) => ({
      id: region,
      location: {
        type: LocationType.RegionDeck
      }
    }))

    this.material(MaterialType.RegionCard).createItems(cards)
    this.material(MaterialType.RegionCard).shuffle()
  }

  setupSanctuaries() {
    const cards = sanctuaries.map((sanctuary) => ({
      id: sanctuary,
      location: {
        type: LocationType.SanctuaryDeck
      }
    }))

    this.material(MaterialType.SanctuaryCard).createItems(cards)
    this.material(MaterialType.SanctuaryCard).shuffle()
  }

  start() {
    this.startPlayerTurn(RuleId.ChooseSanctuaryCard, this.game.players[0])
  }
}