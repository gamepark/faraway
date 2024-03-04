/** @jsxImportSource @emotion/react */
import { GridLocator, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'
import { PlayerRegionLineDescription } from './description/PlayerRegionLineDescription'

export class PlayerRegionLineLocator extends GridLocator {
  itemsPerLine = 4
  itemsGap = { x: regionCardDescription.width + 0.5 }
  linesGap = { y: regionCardDescription.height + 0.5 }

  locationDescription = new PlayerRegionLineDescription()

  getCoordinates(item: MaterialItem, context: ItemContext) {
    const { location } = item
    return {
      ...this.locationDescription.getRegionCoordinates(location, context),
      z: 0.05
    }
  }
}

export const playerRegionLineLocator = new PlayerRegionLineLocator()