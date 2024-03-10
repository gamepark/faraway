/** @jsxImportSource @emotion/react */
import { ItemContext, ItemLocator } from '@gamepark/react-game'
import { Coordinates, MaterialItem } from '@gamepark/rules-api'
import { regionDiscardLocator } from './RegionDiscardLocator'

export class ScorePadLocator extends ItemLocator {
  getPosition(item: MaterialItem, context: ItemContext): Coordinates {
    const deckCoordinates = { ...regionDiscardLocator.getCoordinates(item, context) }
    deckCoordinates.x += 8
    return deckCoordinates
  }
}

export const scorePadLocator = new ScorePadLocator()