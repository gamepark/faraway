import { LocationDescription } from '@gamepark/react-game'
import { regionCardDescription } from '../../material/RegionCardDescription'

export class RegionHandDescription extends LocationDescription {
  width = regionCardDescription.width * 3
  height = regionCardDescription.height + 2
  borderRadius = regionCardDescription.borderRadius
}