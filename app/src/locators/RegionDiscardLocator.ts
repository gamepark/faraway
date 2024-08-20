/** @jsxImportSource @emotion/react */
import { DeckLocator, ItemContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'

export class RegionDiscardLocator extends DeckLocator {
  getCoordinates(_location: Location, context: ItemContext) {
    const playersCount = context.rules.players.length
    return { x: (regionCardDescription.width + 0.5) * (playersCount + 2.5) - 10, y: 4 }
  }

  rotateZ = 90
}

export const regionDiscardLocator = new RegionDiscardLocator()