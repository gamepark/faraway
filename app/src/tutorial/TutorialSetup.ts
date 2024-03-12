import { Region } from '@gamepark/faraway/cards/Region'
import { FarawayOptions } from '@gamepark/faraway/FarawayOptions'
import { FarawaySetup } from '@gamepark/faraway/FarawaySetup'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { RuleId } from '@gamepark/faraway/rules/RuleId'

const me = 1
export class TutorialSetup extends FarawaySetup {

  setupAvailableRegions(options: FarawayOptions) {
    const deck = this
      .material(MaterialType.Region)
      .location(LocationType.RegionDeck)
      .filter((item) => item.id !== Region.Yellow27)
      .deck()

    this
      .material(MaterialType.Region)
      .location(LocationType.RegionDeck)
      .filter((item) => item.id === Region.Yellow27)
      .moveItem({ type: LocationType.Region })

    deck.deal({ type: LocationType.Region }, options.players)
  }

  setupPlayers(options: FarawayOptions) {
    const deck = this.material(MaterialType.Region).deck()
    for (let index = 0; index < options.players; index++) {
      if ((index + 1) === me) {
        deck.filter((item) => [Region.Blue6, Region.Blue21, Region.Yellow31].includes(item.id))
          .deal({ type: LocationType.PlayerRegionHand, player: index + 1 }, 3)
      } else {
        deck
          .filter((item) => [Region.Green67, Region.Red52, Region.Yellow62].includes(item.id))
          .deal({ type: LocationType.PlayerRegionHand, player: index + 1 }, 3)
      }
    }
  }

  start() {
    this.startSimultaneousRule(RuleId.PlaceRegion)
  }

}