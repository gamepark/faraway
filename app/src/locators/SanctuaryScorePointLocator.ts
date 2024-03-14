import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { ItemLocator } from '@gamepark/react-game'
import { SanctuaryScorePointDescription } from './description/SanctuaryScorePointDescription'

export class SanctuaryScorePointLocator extends ItemLocator {
  locationDescription = new SanctuaryScorePointDescription()
  parentItemType = MaterialType.Sanctuary

  getPositionOnParent() {
    return { x: 50, y: 45 }
  }
}

export const sanctuaryScorePointLocator = new SanctuaryScorePointLocator()