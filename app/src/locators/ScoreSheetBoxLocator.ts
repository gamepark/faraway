import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { ScoreSheetBoxDescription } from './description/ScoreSheetBoxDescription'

export class ScoreSheetBoxLocator extends Locator {
  locationDescription = new ScoreSheetBoxDescription()
  parentItemType = MaterialType.Region

  getPositionOnParent(location: Location) {
    return { x: 6 + location.x! * 13.8, y: location.y === 10 ? 92.5 : location.y === 0 ? 6.5 : 9 + location.y! * 8 }
  }
}

export const scoreSheetBoxLocator = new ScoreSheetBoxLocator()