/** @jsxImportSource @emotion/react */
import { getValue } from '@gamepark/faraway/cards/Region'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { HandLocator, ItemContext, LocationDescription, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { orderBy } from 'lodash'
import { regionCardDescription } from '../material/RegionCardDescription'
import { getBoardIndex, getDeltaForPosition } from './position/PositionOnTable'

export class RegionHandLocator extends HandLocator {
  locationDescription = new RegionHandDescription()

  getCoordinates(location: Location, context: ItemContext) {
    return { ...this.locationDescription.getCoordinates(location, context), z: 0 }
  }

  getRadius(item: MaterialItem, context: ItemContext): number {
    const { rules, player } = context
    if (player && player !== item.location.player) return 40
    if (rules.game.rule?.id === RuleId.PlaceSanctuary && rules.game.rule?.player === player && item.location.player === player) return 50
    return 125
  }

  getBaseAngle(item: MaterialItem, { rules, player }: ItemContext): number {
    const index = getBoardIndex(item.location, rules, player)
    return [1, 2, 3].includes(index) ? 180 : 0
  }

  getItemIndex(item: MaterialItem, context: ItemContext): number {
    const { player, rules, index } = context
    if (item.location.player === player) {
      const hand = rules.material(MaterialType.Region).location(LocationType.PlayerRegionHand)
      const coins = hand.player(player)
      const sorted = orderBy(coins.getIndexes(), (index) => getValue(hand.getItem(index)!.id))
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

  getLocations({ player }: MaterialContext): Location[] {
    return player ? [{ type: LocationType.PlayerRegionHand, player }] : []
  }

  getCoordinates(location: Location, context: ItemContext) {
    const { player, rules } = context
    const coordinates = { x: 15, y: 29 }
    const index = getBoardIndex(location, rules, player)
    const delta = getDeltaForPosition(location, rules, player)
    const additionalY = [1, 2, 3].includes(index) ? -25 : 0

    if (rules.game.rule?.id === RuleId.PlaceSanctuary && rules.game.rule?.player === player && location.player === player) coordinates.x += 23.5
    return {
      x: coordinates.x + (delta.x ?? 0),
      y: coordinates.y + (delta.y ?? 0) + additionalY,
      z: 5
    }
  }
}

export const regionHandLocator = new RegionHandLocator()