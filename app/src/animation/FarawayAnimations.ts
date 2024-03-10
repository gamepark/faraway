import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType, isShuffle } from '@gamepark/rules-api'

export const farawayAnimations = new MaterialGameAnimations()

farawayAnimations.when()
  .move((move) => isMoveItemType(MaterialType.Region)(move) && move.location.type === LocationType.Region)
  .duration(0.5)

farawayAnimations.when()
  .move((move) => isMoveItemType(MaterialType.Region)(move) && move.location.type === LocationType.RegionDiscard)
  .duration(0.5)

farawayAnimations.when()
  .move((move) => isMoveItemType(MaterialType.Sanctuary)(move) && move.location.type === LocationType.SanctuaryDeck)
  .duration(0.8)

farawayAnimations.when()
  .move(isShuffle)
  .none()
