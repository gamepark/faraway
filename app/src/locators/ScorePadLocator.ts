/** @jsxImportSource @emotion/react */
import { ItemContext, ItemLocator } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api/dist/material/items/MaterialItem'
import { Coordinates } from '@gamepark/rules-api/dist/material/location/Location'
import { regionDiscardLocator } from './RegionDiscardLocator'

export class ScorePadLocator extends ItemLocator {
  getPosition(item: MaterialItem, context: ItemContext): Coordinates {
    const deckCoordinates = { ...regionDiscardLocator.getCoordinates(item, context) }
    deckCoordinates.x += 8
    return deckCoordinates
  }
}

export const scorePadLocator = new ScorePadLocator()