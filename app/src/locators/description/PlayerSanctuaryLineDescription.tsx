/** @jsxImportSource @emotion/react */
import { LocationDescription } from '@gamepark/react-game'
import { sanctuaryCardDescription } from '../../material/SanctuaryCardDescription'

export class PlayerSanctuaryLineDescription extends LocationDescription {
  width = sanctuaryCardDescription.width * 4 + 1.5
  height = sanctuaryCardDescription.height * 2 + 0.5
  borderRadius = sanctuaryCardDescription.borderRadius
}