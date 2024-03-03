/** @jsxImportSource @emotion/react */
import { GridLocator, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'
import { PlayerSanctuaryLineDescription } from './description/PlayerSanctuaryLineDescription'

export class PlayerSanctuaryLineLocator extends GridLocator {
  itemsPerLine = 4
  itemsGap = { x: -(sanctuaryCardDescription.width + 0.5) }
  linesGap = { y: sanctuaryCardDescription.height + 0.5 }

  locationDescription = new PlayerSanctuaryLineDescription()


  getCoordinates(item: MaterialItem, context: ItemContext) {
    const { location } = item
    return this.locationDescription.getSanctuaryCoordinates(location, context)
  }
}

export const playerSanctuaryLineLocator = new PlayerSanctuaryLineLocator()