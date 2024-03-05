/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { getBoardIndex, getDeltaForPosition } from './position/PositionOnTable'

export class RegionHandLocator extends HandLocator {
  delta = { x: -0.04, y: -0.04 }
  getCoordinates(location: Location, context: ItemContext) {
    const { player, rules } = context
    const coordinates = { x: 15, y: 29, z: 0}
    const index = getBoardIndex(location, rules, player)
    const delta = getDeltaForPosition(location, rules, player)
    const additionaleY = [1, 2, 3].includes(index)? -25: 0

    if (rules.game.rule?.id === RuleId.PlaceSanctuary && rules.game.rule?.player === player && location.player === player) coordinates.x += 23.5
    return {
      x: coordinates.x + (delta.x ?? 0),
      y: coordinates.y + (delta.y ?? 0) + additionaleY,
      z: coordinates.z
    }
  }

  getRadius(item: MaterialItem, context: ItemContext): number {
    const { rules, player } = context
    if (player && player !== item.location.player) return 40
    if (rules.game.rule?.id === RuleId.PlaceSanctuary && rules.game.rule?.player === player && item.location.player === player) return 50
    return 125
  }

  getBaseAngle(item: MaterialItem, { rules, player }: ItemContext): number {
    const index = getBoardIndex(item.location, rules, player)
    return [1, 2, 3].includes(index)? 180: 0
  }
}

export const regionHandLocator = new RegionHandLocator()