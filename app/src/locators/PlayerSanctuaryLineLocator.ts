import { GridLocator, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'

export class PlayerSanctuaryLineLocator extends GridLocator {
  itemsPerLine = 4
  itemsGap = { x: -(sanctuaryCardDescription.width + 0.5) }
  linesGap = { y: sanctuaryCardDescription.height + 0.5 }


  getCoordinates(item: MaterialItem, context: ItemContext) {
    const { location } = item
    const { player, rules } = context
    if (location.player === (player ?? rules.players[0])) {
      return { x: -7.5, y: 13, z: 0}
    }

    return { x: -7.5, y: -13, z: 0}
  }
}

export const playerSanctuaryLineLocator = new PlayerSanctuaryLineLocator()