/** @jsxImportSource @emotion/react */
import { getValue } from '@gamepark/faraway/cards/Region'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { orderBy } from 'lodash'
import { getPlayerBoardPosition, getPlayerIndex } from './position/PositionOnTable'

export class RegionHandLocator extends HandLocator {
  clockwise = false

  getCoordinates(location: Location, context: ItemContext) {
    const { player } = context
    let { x = 0, y = 0 } = getPlayerBoardPosition(context, location.player)
    x += 11.2
    y += 29

    if (player === location.player) {
      const sanctuaryHand = context.rules.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryHand).player(player).length
      if (sanctuaryHand > 6) {
        x += Math.min((sanctuaryHand - 6) * 3.7, 31)
      }
    }

    if ([1, 2, 3].includes(getPlayerIndex(context, location.player))) {
      y -= 25
    }

    return { x: x, y: y, z: 1 }
  }

  getRadius(location: Location, { player }: ItemContext): number {
    return location.player === player ? 125 : 40
  }

  getBaseAngle(location: Location, context: ItemContext): number {
    const index = getPlayerIndex(context, location.player)
    return [1, 2, 3].includes(index) ? 180 : 0
  }

  getItemIndex(item: MaterialItem, context: ItemContext): number {
    const { player, rules, index } = context
    if (item.location.player === player) {
      const hand = rules.material(MaterialType.Region).location(LocationType.PlayerRegionHand)
      const coins = hand.player(player)
      const sorted = orderBy(coins.getIndexes(), (index) => -getValue(hand.getItem(index).id))
      return sorted.indexOf(index)
    } else {
      return item.location.x!
    }
  }
}

export const regionHandLocator = new RegionHandLocator()