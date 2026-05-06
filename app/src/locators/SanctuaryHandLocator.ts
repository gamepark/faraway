import { HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { isNotViewedPlayerItem } from './hidePlayerContent'
import { HAND_Y, SANCTUARY_CENTER_X } from './playerLayout'

export class SanctuaryHandLocator extends HandLocator {
  maxAngle = 16

  hide(item: MaterialItem, context: ItemContext): boolean {
    return isNotViewedPlayerItem(item, context)
  }

  // The sanctuary fan widens with the hand size — once it goes past ~6 cards,
  // shift the anchor right so the leftmost cards stay on-screen.
  getCoordinates(location: Location, context: MaterialContext) {
    let x = SANCTUARY_CENTER_X
    const count = this.countItems(location, context)
    // From 6 cards on, shift the fan anchor right so the fan stays clear of the
    // table edge as it widens. ~4em per extra card past 5.
    if (count >= 6) {
      x += (count - 5) * 4
    }
    return { x, y: HAND_Y, z: 3 }
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
