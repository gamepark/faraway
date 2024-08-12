/** @jsxImportSource @emotion/react */
import { LocationDescription } from '@gamepark/react-game'
import { regionCardDescription } from '../../material/RegionCardDescription'

export class RegionDeckDescription extends LocationDescription {
  height = regionCardDescription.height + 1
  width = regionCardDescription.width + 1
  borderRadius = regionCardDescription.borderRadius
}