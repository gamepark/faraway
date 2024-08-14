/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { FlexLocator, LocationContext, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'
import { PlayerSanctuaryLineDescription } from './description/PlayerSanctuaryLineDescription'
import { getPlayerBoardPosition } from './position/PositionOnTable'

export class PlayerSanctuaryLineLocator extends FlexLocator {
  gap = { y: sanctuaryCardDescription.height + 0.5 }
  lineGap = { x: -sanctuaryCardDescription.width - 0.5 }
  maxLines = 4
  locationDescription = new PlayerSanctuaryLineDescription()

  getLocations({ player }: MaterialContext) {
    return player ? [{ type: LocationType.PlayerSanctuaryLine, player }] : []
  }

  getOriginCoordinates(location: Location, context: LocationContext) {
    const { x = 0, y = 0 } = getPlayerBoardPosition(context, location.player)
    return { x: x - 7.5, y: y + 13, z: 0 }
  }
}

export const playerSanctuaryLineLocator = new PlayerSanctuaryLineLocator()