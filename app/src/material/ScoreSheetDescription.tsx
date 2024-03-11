import { LocationType } from '@gamepark/faraway/material/LocationType'
import { FlatMaterialDescription } from '@gamepark/react-game'
import ScoreSheet from '../images/ScoreSheet.jpg'


export class ScoreSheetDescription extends FlatMaterialDescription {
  width = 7.2
  height = 9.9

  image = ScoreSheet

  staticItem = {
    location: {
      type: LocationType.ScoreSheet
    }
  }
}

export const scoreSheetDescription = new ScoreSheetDescription()