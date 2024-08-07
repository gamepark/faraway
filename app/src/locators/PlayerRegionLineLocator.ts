/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { FlexLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'
import { PlayerRegionLineDescription } from './description/PlayerRegionLineDescription'

export class PlayerRegionLineLocator extends FlexLocator {
  itemsPerLine = 4
  itemsGap = { x: regionCardDescription.width + 0.5 }
  linesGap = { y: regionCardDescription.height + 0.5 }

  locationDescription = new PlayerRegionLineDescription()

  getLocations(context: MaterialContext) {
    const { rules } = context
    return rules.players.flatMap((p) => Array.from(Array(8))
      .map((_, x) => ({
        type: LocationType.PlayerRegionLine,
        player: p,
        x: x
      })))
  }

  getCoordinates(item: MaterialItem, context: ItemContext) {
    const { location } = item
    return {
      ...this.locationDescription.getRegionCoordinates(location, context),
      z: 0.05
    }
  }
}

export const playerRegionLineLocator = new PlayerRegionLineLocator()