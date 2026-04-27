import { Locator } from '@gamepark/react-game'
import { scoreSheetX, scoreSheetY } from '../panels/PanelConstants'

export class ScoreSheetLocator extends Locator {
  getLocationCoordinates() {
    return { x: scoreSheetX, y: scoreSheetY }
  }
}

export const scoreSheetLocator = new ScoreSheetLocator()
