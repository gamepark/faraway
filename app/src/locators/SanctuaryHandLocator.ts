/** @jsxImportSource @emotion/react */
import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { getPlayerBoardPosition, getPlayerIndex } from './position/PositionOnTable'

export class SanctuaryHandLocator extends HandLocator {
  getMaxAngle() {
    return 16
  }

  getCoordinates(location: Location, context: ItemContext) {
    const { player } = context
    let { x = 0, y = 0 } = getPlayerBoardPosition(context, location.player)
    x -= 11
    y += 29

    const count = this.countItems(location, context)
    if (player !== location.player) {
      x += 4
    } else if (count >= 6) {
      x += (count - 7) * 2
    }

    if ([1, 2, 3].includes(getPlayerIndex(context, location.player))) {
      y -= 24.5
    }

    return { x: x, y: y, z: 3 }
  }

  getRadius(location: Location, { player }: ItemContext): number {
    return player === location.player ? 200 : 40
  }

  getGapMaxAngle(location: Location, context: ItemContext): number {
    if (context.player === location.player) {
      const count = this.countItems(location, context)
      if (count > 6) {
        return 1.25 - (count - 6) * 0.01
      }
    }
    return 1.25
  }

  getBaseAngle(location: Location, context: ItemContext): number {
    const index = getPlayerIndex(context, location.player)
    return [1, 2, 3].includes(index) ? 180 : 0
  }
}

export const sanctuaryHandLocator = new SanctuaryHandLocator()