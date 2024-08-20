/** @jsxImportSource @emotion/react */
import { DropAreaDescription } from '@gamepark/react-game'
import { sanctuaryCardDescription } from '../../material/SanctuaryCardDescription'

export class PlayerSanctuaryLineDescription extends DropAreaDescription {
  width = sanctuaryCardDescription.width * 4 + 1.5
  height = sanctuaryCardDescription.height * 2 + 0.5
  borderRadius = sanctuaryCardDescription.borderRadius
}