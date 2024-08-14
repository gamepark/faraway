/** @jsxImportSource @emotion/react */
import { DeckLocator } from '@gamepark/react-game'

export class SanctuaryDeckLocator extends DeckLocator {
  coordinates = { x: -17.5, y: 4 }
}

export const sanctuaryDeckLocator = new SanctuaryDeckLocator()