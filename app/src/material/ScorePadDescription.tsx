import { LocationType } from '@gamepark/faraway/material/LocationType'
import { CardDescription } from '@gamepark/react-game'
import ScorePad from '../images/score/score.jpg'


export class ScorePadDescription extends CardDescription {
  width = 5
  ratio = 5 / 6.88
  borderRadius = 0

  image = ScorePad

  staticItem = {
    location: {
      type: LocationType.ScorePad
    }
  }
}

export const scorePadDescription = new ScorePadDescription()