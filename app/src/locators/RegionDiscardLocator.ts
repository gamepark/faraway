/** @jsxImportSource @emotion/react */
import { DeckLocator, ItemContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'
import { regionDeckLocator } from './RegionDeckLocator'

export class RegionDiscardLocator extends DeckLocator {
  getCoordinates(location: Location, context: ItemContext) {
    const { x = 0, y } = regionDeckLocator.getCoordinates(location, context)
    const playersCount = context.rules.players.length
    return { x: x + (regionCardDescription.width + 0.5) * (playersCount + 2.5), y }
  }

  rotateZ = 90
}

export const regionDiscardLocator = new RegionDiscardLocator()