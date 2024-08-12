/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { DeckLocator } from '@gamepark/react-game'
import { RegionDeckDescription } from './description/RegionDeckDescription'

export class RegionDeckLocator extends DeckLocator {
  location = { type: LocationType.RegionDeck }
  locationDescription = new RegionDeckDescription()
  coordinates = { x: -10, y: 4 }
}

export const regionDeckLocator = new RegionDeckLocator()