import { LocationType } from '@gamepark/faraway/material/LocationType'
import { DeckLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'
import { getRegionDiscardPosition, regionDiscardScale } from '../panels/PanelConstants'
import { RegionDiscardAreaDescription } from './description/RegionDiscardAreaDescription'

export class RegionDiscardLocator extends DeckLocator {
  rotateZ = 90

  // Surface the location so its clickable drop area is rendered — without it
  // the help dialog has no entry point. The area sits beneath the rendered pile
  // (card size × discard scale) so a click on the pile (or its outline when
  // empty) opens RegionDiscardHelp.
  location = { type: LocationType.RegionDiscard }
  locationDescription = new RegionDiscardAreaDescription({
    width: regionCardDescription.width * regionDiscardScale,
    height: regionCardDescription.height * regionDiscardScale,
    borderRadius: regionCardDescription.borderRadius
  })

  getCoordinates(_location: Location, context: MaterialContext) {
    return getRegionDiscardPosition(context.rules.players.length)
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    return [...super.placeItem(item, context), `scale(${regionDiscardScale})`]
  }
}

export const regionDiscardLocator = new RegionDiscardLocator()
