import { getValue } from '@gamepark/faraway/cards/Region'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { DropAreaDescription, HandLocator, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { orderBy } from 'es-toolkit/compat'
import { isNotViewedPlayerItem } from './hidePlayerContent'
import { HAND_Y, REGION_CENTER_X } from './playerLayout'

export class RegionHandLocator extends HandLocator {
  locationDescription = new DropAreaDescription({ width: 20, height: 8, borderRadius: 0.4 })

  clockwise = false

  coordinates = { x: REGION_CENTER_X, y: HAND_Y, z: 1 }

  hide(item: MaterialItem, context: ItemContext): boolean {
    return isNotViewedPlayerItem(item, context)
  }

  getRadius(): number {
    return 125
  }

  getItemIndex(item: MaterialItem, context: ItemContext): number {
    const { player, rules, index } = context
    if (item.location.player === player) {
      const hand = rules.material(MaterialType.Region).location(LocationType.PlayerRegionHand)
      const coins = hand.player(player)
      const sorted = orderBy(coins.getIndexes(), [(index) => -getValue(hand.getItem(index).id)])
      return sorted.indexOf(index)
    } else {
      return item.location.x!
    }
  }

  getHoverTransform(item: MaterialItem, context: ItemContext) {
    return super.getHoverTransform(item, context).concat('translateY(-1em)').concat('translateZ(16em)')
  }
}

export const regionHandLocator = new RegionHandLocator()
