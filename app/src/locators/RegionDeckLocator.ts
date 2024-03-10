/** @jsxImportSource @emotion/react */
import { DeckLocator } from '@gamepark/react-game'
import { RegionDeckDescription } from './description/RegionDeckDescription'

export class RegionDeckLocator extends DeckLocator {
  locationDescription = new RegionDeckDescription()
  delta = { x: -0.04, y: -0.04 }
  coordinates = this.locationDescription.deckCoordinates
}

export const regionDeckLocator = new RegionDeckLocator()