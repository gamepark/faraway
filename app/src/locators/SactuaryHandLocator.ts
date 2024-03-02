import { HandLocator, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'

export class SanctuaryHandLocator extends HandLocator {
  delta = { x: -0.04, y: -0.04 }
  getCoordinates(location: Location, context: ItemContext) {
    const { player, rules } = context
    if (location.player === (player ?? rules.players[0])) {
      return { x: -30, y: 15, z: 0}
    }

    return { x: 40, y: -15, z: 0}
  }

  getRadius(item: MaterialItem, context: ItemContext): number {
    const { player } = context
    return player === item.location.player? 135: super.getRadius(item, context)
  }

  getBaseAngle(item: MaterialItem, { player, rules }: ItemContext): number {
    return item.location.player === (player ?? rules.players[0]) ? 0 : 180
  }
}

export const sanctuaryHandLocator = new SanctuaryHandLocator()