/** @jsxImportSource @emotion/react */
import { ListLocator } from '@gamepark/react-game'
import { regionCardDescription } from '../material/RegionCardDescription'

export class RegionLocator extends ListLocator {
  gap = { x: regionCardDescription.width + 0.5 }
  coordinates = { x: -2.5, y: 4 }
}

export const regionLocator = new RegionLocator()