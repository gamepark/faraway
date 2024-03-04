/** @jsxImportSource @emotion/react */
import { DeckLocator, ItemContext } from '@gamepark/react-game'
import { Coordinates, MaterialItem } from '@gamepark/rules-api'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'
import { sanctuaryDeckLocator } from './SanctuaryDeckLocator'

export class SanctuaryDiscardLocator extends DeckLocator {
  delta = { x: -0.04, y: -0.04 }

  getCoordinates(item: MaterialItem, context: ItemContext): Coordinates {
    const deckCoordinates = { ...sanctuaryDeckLocator.getCoordinates(item, context) }
    deckCoordinates.x -= sanctuaryCardDescription.width + 2
    return deckCoordinates
  }
}

export const sanctuaryDiscardLocator = new SanctuaryDiscardLocator()