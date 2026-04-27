import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { isNotViewedPlayerItem } from './hidePlayerContent'
import { HAND_Y, SANCTUARY_CENTER_X } from './playerLayout'

export class SanctuaryHandLocator extends HandLocator {
  maxAngle = 16

  coordinates = { x: SANCTUARY_CENTER_X, y: HAND_Y, z: 3 }

  hide(item: MaterialItem, context: ItemContext): boolean {
    return isNotViewedPlayerItem(item, context)
  }

  getRadius(): number {
    return 200
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

  getHoverTransform(item: MaterialItem, context: ItemContext) {
    return super.getHoverTransform(item, context).concat('translateY(-1em)')
  }
}

export const sanctuaryHandLocator = new SanctuaryHandLocator()
