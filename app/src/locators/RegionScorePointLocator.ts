import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { ItemLocator } from '@gamepark/react-game'
import { RegionScorePointDescription } from './description/RegionScorePointDescription'

export class RegionScorePointLocator extends ItemLocator {
  locationDescription = new RegionScorePointDescription()
  parentItemType = MaterialType.Region

  getPositionOnParent() {
    return { x: 15, y: 40 }
  }
}

export const regionScorePointLocator = new RegionScorePointLocator()