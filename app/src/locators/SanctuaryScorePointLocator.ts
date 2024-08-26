import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { SanctuaryScorePointDescription } from './description/SanctuaryScorePointDescription'

export class SanctuaryScorePointLocator extends Locator {
  locationDescription = new SanctuaryScorePointDescription()
  parentItemType = MaterialType.Sanctuary
  positionOnParent = { x: 50, y: 45 }
}

export const sanctuaryScorePointLocator = new SanctuaryScorePointLocator()