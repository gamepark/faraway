/** @jsxImportSource @emotion/react */
import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { getBoardIndex, getDeltaForPosition } from './position/PositionOnTable'

export class SanctuaryHandLocator extends HandLocator {
  delta = { x: -0.04, y: -0.04 }

  getMaxAngle() {
    return 16
  }

  getCoordinates(location: Location, context: ItemContext) {
    const { player, rules } = context
    const coordinates = { x: -11, y: 29, z: 0 }
    const index = getBoardIndex(location, rules, player)
    const delta = getDeltaForPosition(location, rules, player)
    const top = [1, 2, 3].includes(index) ? -24.5 : 0
    const count = this.countItems(location, context)

    if (player === location.player) {
      coordinates.z = 3
      if (count >= 6) {
        coordinates.x += (count - 7) * 2
      }
      /*if (count >= 6 && count < 8) {
        coordinates.x += (count - 8) * 2.2
      } else if (count > 9) {
        coordinates.x += (count - 9) * 2.2
      }*/
    } else {
      coordinates.x += 4
    }

    return {
      x: coordinates.x + (delta.x ?? 0),
      y: coordinates.y + (delta.y ?? 0) + top,
      z: coordinates.z
    }
  }

  getRadius(item: MaterialItem, { player }: ItemContext): number {
    return player === item.location.player ? 200 : 40
  }

  getGapMaxAngle(item: MaterialItem, context: ItemContext): number {
    if (context.player === item.location.player) {
      const count = this.countItems(item.location, context)
      if (count > 6) {
        return 1.25 - (count - 6) * 0.01
      }
    }
    return 1.25
  }

  getBaseAngle(item: MaterialItem, { rules, player }: ItemContext): number {
    const index = getBoardIndex(item.location, rules, player)
    return [1, 2, 3].includes(index) ? 180 : 0
  }
}

export const sanctuaryHandLocator = new SanctuaryHandLocator()