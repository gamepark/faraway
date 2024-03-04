/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { getBoardIndex, getDeltaForPosition } from './position/PositionOnTable'

export class SanctuaryHandLocator extends HandLocator {
  delta = { x: -0.04, y: -0.04 }
  getCoordinates(location: Location, context: ItemContext) {
    const { player, rules } = context
    const coordinates = { x: -11, y: 30, z: 0}
    const index = getBoardIndex(location, rules, player)
    const delta = getDeltaForPosition(location, rules, player)
    const top = [1, 2, 3].includes(index)? -25.5: 0

    if (player && player !== location.player) {
      coordinates.x += 10
    }

    if (rules.game.rule?.id === RuleId.PlaceSanctuary && rules.game.rule?.player === player && location.player === player) {
      coordinates.x += 14
      coordinates.y -= 1
    }

    return {
      x: coordinates.x + (delta.x ?? 0),
      y: coordinates.y + (delta.y ?? 0) + top,
      z: coordinates.z
    }
  }

  getRadius(item: MaterialItem, context: ItemContext): number {
    const { rules, player } = context
    if (player && player !== item.location.player) return 50
    if (rules.game.rule?.id === RuleId.PlaceSanctuary && rules.game.rule?.player === player && item.location.player === player) return 200
    return 80
  }

  getGapMaxAngle(item: MaterialItem, context: ItemContext): number {
    const { rules, player } = context
    if (rules.game.rule?.id === RuleId.PlaceSanctuary && rules.game.rule?.player === player && item.location.player === player) return 1.25
    return 3.1
  }

  getBaseAngle(item: MaterialItem, { rules, player }: ItemContext): number {
    const index = getBoardIndex(item.location, rules, player)
    return [1, 2, 3].includes(index)? 180: 0
  }
}

export const sanctuaryHandLocator = new SanctuaryHandLocator()