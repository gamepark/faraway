/** @jsxImportSource @emotion/react */
import { DeckLocator } from '@gamepark/react-game'

export class SanctuaryDeckLocator extends DeckLocator {
  delta = { x: -0.04, y: -0.04 }
  coordinates = { x: -15, y: 4, z: 0}
}

export const sanctuaryDeckLocator = new SanctuaryDeckLocator()