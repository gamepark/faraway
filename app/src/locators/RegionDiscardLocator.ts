import { DeckLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { getRegionDiscardPosition, regionDiscardScale } from '../panels/PanelConstants'

export class RegionDiscardLocator extends DeckLocator {
  rotateZ = 90

  getCoordinates(_location: Location, context: MaterialContext) {
    return getRegionDiscardPosition(context.rules.players.length)
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    return [...super.placeItem(item, context), `scale(${regionDiscardScale})`]
  }
}

export const regionDiscardLocator = new RegionDiscardLocator()
