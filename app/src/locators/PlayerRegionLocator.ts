import { LocationType } from '@gamepark/faraway/material/LocationType'
import { FlexLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { PlayerRegionAreaDescription } from './description/PlayerRegionAreaDescription'
import { isNotViewedPlayerItem } from './hidePlayerContent'
import { getViewPlayer } from './panelCoordinates'
import { REGION_ANCHOR_X, REGION_COLUMN_GAP, REGION_LINE_SIZE, REGION_Y } from './playerLayout'

export class PlayerRegionLocator extends FlexLocator {
  lineSize = REGION_LINE_SIZE
  gap = { x: REGION_COLUMN_GAP }
  lineGap = { y: REGION_COLUMN_GAP }

  coordinates = { x: REGION_ANCHOR_X, y: REGION_Y }

  locationDescription = new PlayerRegionAreaDescription()

  hide(item: MaterialItem, context: ItemContext): boolean {
    return isNotViewedPlayerItem(item, context)
  }

  getLocations(context: MaterialContext) {
    const viewed = getViewPlayer(context)
    if (viewed === undefined) return []
    return Array.from(Array(8)).map((_, x) => ({
      type: LocationType.PlayerRegionLine,
      player: viewed,
      x
    }))
  }

  getHoverTransform(item: MaterialItem) {
    return item.id !== undefined ? ['translateZ(10em)', 'scale(2)'] : []
  }
}

export const playerRegionLocator = new PlayerRegionLocator()
