/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { FlexLocator, LocationContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'
import { PlayerRegionAreaDescription } from './description/PlayerRegionAreaDescription'
import { getPlayerBoardPosition } from './position/PositionOnTable'

export class PlayerRegionLocator extends FlexLocator {
  lineSize = 4
  gap = { x: regionCardDescription.width + 0.5 }
  lineGap = { y: regionCardDescription.height + 0.5 }

  locationDescription = new PlayerRegionAreaDescription()

  getLocations(context: MaterialContext) {
    const { rules } = context
    return rules.players.flatMap((p) => Array.from(Array(8))
      .map((_, x) => ({
        type: LocationType.PlayerRegionLine,
        player: p,
        x: x
      })))
  }

  getCoordinates(location: Location, context: LocationContext) {
    const { x = 0, y = 0 } = getPlayerBoardPosition(context, location.player)
    return { x, y: y + 13 }
  }

  getHoverTransform(item: MaterialItem) {
    return item.id !== undefined ? ['translateZ(10em)', 'scale(2)'] : []
  }
}

export const playerRegionLocator = new PlayerRegionLocator()