import { FarawayOptions } from '@gamepark/faraway/FarawayOptions'
import { FarawaySetup } from '@gamepark/faraway/FarawaySetup'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'

/**
 * Dev-only setup — places 8 sanctuaries in player 1's sanctuary line so the layout
 * can be eyeballed without playing through the game.
 */
export class DevFarawaySetup extends FarawaySetup {
  setupPlayers(options: FarawayOptions) {
    super.setupPlayers(options)
    const sanctuaryDeck = this.material(MaterialType.Sanctuary).location(LocationType.SanctuaryDeck).deck()
    sanctuaryDeck.deal({ type: LocationType.PlayerSanctuaryLine, player: 1 }, 8)
  }
}
