import { DeckLocator } from '@gamepark/react-game'

export class RegionDeckLocator extends DeckLocator {
  delta = { x: -0.04, y: -0.04 }
  coordinates = { x: -7.5, y: 4, z: 0}
}

export const regionDeckLocator = new RegionDeckLocator()