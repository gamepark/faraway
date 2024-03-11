/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { LocationContext, LocationDescription } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { regionCardDescription } from '../../material/RegionCardDescription'

export class RegionDeckDescription extends LocationDescription {
  height = regionCardDescription.height + 0.8
  width = regionCardDescription.width + 0.8
  borderRadius = regionCardDescription.borderRadius

  location = { type: LocationType.RegionDeck }
  getCoordinates(_location: Location, _context: LocationContext) {
    return {
      x: this.deckCoordinates.x - 0.4,
      y: this.deckCoordinates.y - 0.4,
      z: 10
    }
  }

  deckCoordinates = { x: -10, y: 4, z: 0}
}