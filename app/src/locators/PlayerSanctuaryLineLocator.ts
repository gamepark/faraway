/** @jsxImportSource @emotion/react */
import { ItemContext, ItemLocator } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'
import { PlayerSanctuaryLineDescription } from './description/PlayerSanctuaryLineDescription'

export class PlayerSanctuaryLineLocator extends ItemLocator {
  locationDescription = new PlayerSanctuaryLineDescription()

  getPosition(item: MaterialItem, context: ItemContext) {
    const { x, y, z } = this.locationDescription.getSanctuaryCoordinates(item.location, context)
    return {
      x: x - Math.floor(item.location.x! / 2) * (sanctuaryCardDescription.width + 0.5),
      y: y + (item.location.x! % 2) * (sanctuaryCardDescription.height + 0.5),
      z
    }
  }
}

export const playerSanctuaryLineLocator = new PlayerSanctuaryLineLocator()