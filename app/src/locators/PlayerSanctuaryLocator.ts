/** @jsxImportSource @emotion/react */
import { FlexLocator, LocationContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'
import { getPlayerBoardPosition } from './position/PositionOnTable'

export class PlayerSanctuaryLocator extends FlexLocator {
  gap = { y: sanctuaryCardDescription.height + 0.5 }
  lineGap = { x: -sanctuaryCardDescription.width - 0.5 }
  maxLines = 4

  getCoordinates(location: Location, context: LocationContext) {
    const { x = 0, y = 0 } = getPlayerBoardPosition(context, location.player)
    return { x: x - 7.5, y: y + 13 }
  }

  getHoverTransform() {
    return ['translateZ(10em)', 'scale(2)']
  }
}

export const playerSanctuaryLocator = new PlayerSanctuaryLocator()