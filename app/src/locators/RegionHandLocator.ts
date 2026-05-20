import { getValue } from '@gamepark/faraway/cards/Region'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { DropAreaDescription, HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { orderBy } from 'es-toolkit/compat'
import { isNotViewedPlayerItem } from './hidePlayerContent'
import { getViewPlayer } from './panelCoordinates'
import { HAND_Y, REGION_CENTER_X } from './playerLayout'

export class RegionHandLocator extends HandLocator {
  locationDescription = new DropAreaDescription({ width: 20, height: 8, borderRadius: 0.4 })

  clockwise = false

  hide(item: MaterialItem, context: ItemContext): boolean {
    return isNotViewedPlayerItem(item, context)
  }

  // Once the sanctuary hand reaches 6 cards, its fan starts encroaching on the region hand —
  // shift the region hand right to keep clear of the sanctuary fan (capped at 31em).
  // The sanctuary anchor shifts by ~4em/card past 5; we shift faster (~6em/card) so the
  // gap between fans stays roughly constant rather than shrinking.
  getCoordinates(location: Location, context: MaterialContext) {
    let x = REGION_CENTER_X
    const sanctuaryHand = this.getSanctuaryHandCount(location, context)
    if (sanctuaryHand >= 6) {
      x += Math.min((sanctuaryHand - 5) * 6, 31)
    }
    return { x, y: HAND_Y, z: 1 }
  }

  // Re-render whenever either the region hand size OR the sanctuary hand size changes —
  // the framework caches positions on equality of this value, and `getCoordinates` reads
  // both counts.
  getPositionDependencies(location: Location, context: MaterialContext) {
    return {
      regionHand: this.countItems(location, context),
      sanctuaryHand: this.getSanctuaryHandCount(location, context)
    }
  }

  private getSanctuaryHandCount(location: Location, context: MaterialContext): number {
    const player = location.player ?? getViewPlayer(context)
    if (player === undefined) return 0
    return context.rules
      .material(MaterialType.Sanctuary)
      .location(LocationType.PlayerSanctuaryHand)
      .player(player)
      .length
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

  // Help-dialog navigation arrows must walk the hand in the same order the fan
  // displays cards. With `clockwise = false` and getItemIndex sorting by -value,
  // the leftmost card on screen is the HIGHEST value but the rightmost end of
  // the navigation arc (last index in the sort). So "next" must walk from low
  // to high value to read left-to-right visually.
  navigationSorts = [(item: MaterialItem) => getValue(item.id)]

  getHoverTransform(item: MaterialItem, context: ItemContext) {
    return super.getHoverTransform(item, context).concat('translateY(-1em)').concat('translateZ(16em)')
  }
}

export const regionHandLocator = new RegionHandLocator()
