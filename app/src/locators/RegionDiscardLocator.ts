/** @jsxImportSource @emotion/react */
import { DeckLocator, ItemContext } from '@gamepark/react-game'
import { Coordinates, MaterialItem } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'
import { regionDeckLocator } from './RegionDeckLocator'

export class RegionDiscardLocator extends DeckLocator {
  delta = { x: -0.04, y: -0.04 }

  getCoordinates(item: MaterialItem, context: ItemContext): Coordinates {
    const deckCoordinates = { ...regionDeckLocator.getCoordinates(item, context) }
    const playersCount = context.rules.players.length
    deckCoordinates.x += ((regionCardDescription.width + 0.5) * (playersCount + 3))
    deckCoordinates.z = 0
    return deckCoordinates
  }
}

export const regionDiscardLocator = new RegionDiscardLocator()