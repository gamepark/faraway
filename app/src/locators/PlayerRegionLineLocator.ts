/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { FlexLocator, LocationContext, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'
import { PlayerRegionLineDescription } from './description/PlayerRegionLineDescription'
import { getDeltaForPosition } from './position/PositionOnTable'

export class PlayerRegionLineLocator extends FlexLocator {
  lineSize = 4
  gap = { x: regionCardDescription.width + 0.5 }
  lineGap = { y: regionCardDescription.height + 0.5 }

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

  getOriginCoordinates(location: Location, context: LocationContext) {
    const { player, rules } = context
    const { x = 0, y = 0 } = getDeltaForPosition(location, rules, player)
    return { x, y: y + 13 }
  }
}

export const playerRegionLineLocator = new PlayerRegionLineLocator()