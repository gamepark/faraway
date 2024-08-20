/** @jsxImportSource @emotion/react */
import { DropAreaDescription } from '@gamepark/react-game'
import { regionCardDescription } from '../../material/RegionCardDescription'

export class RegionDeckDescription extends DropAreaDescription {
  height = regionCardDescription.height + 1
  width = regionCardDescription.width + 1
  borderRadius = regionCardDescription.borderRadius
}