import { MaterialGameAnimations } from '@gamepark/react-game'
import { isShuffle } from '@gamepark/rules-api'

export const farawayAnimations = new MaterialGameAnimations()

farawayAnimations.when()
  .move(isShuffle)
  .none()
