import { GridLocator, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'

export class PlayerRegionLineLocator extends GridLocator {
  itemsPerLine = 4
  itemsGap = { x: regionCardDescription.width + 0.5 }
  linesGap = { y: regionCardDescription.height + 0.5 }


  getCoordinates(item: MaterialItem, context: ItemContext) {
    const { location } = item
    const { player, rules } = context
    if (location.player === (player ?? rules.players[0])) {
      return { x: 0, y: 13, z: 0}
    }

    return { x: 0, y: -13, z: 0}
  }
}

export const playerRegionLineLocator = new PlayerRegionLineLocator()