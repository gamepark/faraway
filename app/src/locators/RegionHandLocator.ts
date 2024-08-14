/** @jsxImportSource @emotion/react */
import { getValue } from '@gamepark/faraway/cards/Region'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { HandLocator, ItemContext, LocationDescription, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { orderBy } from 'lodash'
import { regionCardDescription } from '../material/RegionCardDescription'
import { getPlayerBoardPosition, getPlayerIndex } from './position/PositionOnTable'

export class RegionHandLocator extends HandLocator {
  locationDescription = new RegionHandDescription()

  getLocations({ player }: MaterialContext): Location[] {
    return player ? [{ type: LocationType.PlayerRegionHand, player }] : []
  }

  isClockwise() {
    return false
  }

  getHandCoordinates(location: Location, context: ItemContext) {
    return { ...this.locationDescription.getCoordinates(location, context), z: 1 }
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
      const sorted = orderBy(coins.getIndexes(), (index) => -getValue(hand.getItem(index)!.id))
      return sorted.indexOf(index)
    } else {
      return item.location.x!
    }
  }
}

class RegionHandDescription extends LocationDescription {
  width = regionCardDescription.width * 3
  height = regionCardDescription.height + 2
  borderRadius = regionCardDescription.borderRadius

  getCoordinates(location: Location, context: ItemContext) {
    const { player } = context
    const coordinates = { x: 11.2, y: 29 }
    const index = getPlayerIndex(context, location.player)
    const delta = getPlayerBoardPosition(context, location.player)
    const additionalY = [1, 2, 3].includes(index) ? -25 : 0

    if (player === location.player) {
      const sanctuaryHand = context.rules.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryHand).player(player).length
      if (sanctuaryHand > 6) {
        coordinates.x += Math.min((sanctuaryHand - 6) * 3.7, 31)
      }
    }

    return {
      x: coordinates.x + (delta.x ?? 0),
      y: coordinates.y + (delta.y ?? 0) + additionalY,
      z: 5
    }
  }
}

export const regionHandLocator = new RegionHandLocator()