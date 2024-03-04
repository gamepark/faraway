/** @jsxImportSource @emotion/react */
import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'

export class SanctuaryHandLocator extends HandLocator {
  delta = { x: -0.04, y: -0.04 }
  getCoordinates(location: Location, context: ItemContext) {
    const { player, rules } = context
    if (location.player === (player ?? rules.players[0])) {
      return { x: -15, y: 30, z: 0}
    }

    return { x: -15, y: -22, z: 0}
  }

  getRadius(): number {
    return 80
  }

  getBaseAngle(item: MaterialItem, { rules, player }: ItemContext): number {
    return (item.location.player === (player ?? rules.players[0]))? 0: 180
  }
}

export const sanctuaryHandLocator = new SanctuaryHandLocator()