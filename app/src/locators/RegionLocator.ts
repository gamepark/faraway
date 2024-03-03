/** @jsxImportSource @emotion/react */
import { LineLocator } from '@gamepark/react-game'
import { regionCardDescription } from '../material/RegionCardDescription'

export class RegionLocator extends LineLocator {
  delta = { x: regionCardDescription.width + 0.5}
  coordinates = { x: 0, y: 4, z: 0}
}

export const regionLocator = new RegionLocator()