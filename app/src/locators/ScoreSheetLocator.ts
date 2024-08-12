/** @jsxImportSource @emotion/react */
import { ItemContext, Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { regionDiscardLocator } from './RegionDiscardLocator'

export class ScoreSheetLocator extends Locator {
  getLocationCoordinates(location: Location, context: ItemContext) {
    const { x, y, z } = regionDiscardLocator.getOriginCoordinates(location, context)
    return { x: x + 8, y, z }
  }
}

export const scoreSheetLocator = new ScoreSheetLocator()