import { ListLocator } from '@gamepark/react-game'
import { regionCardDescription } from '../material/RegionCardDescription'

class RegionLocator extends ListLocator {
  coordinates = { x: -2.5, y: 4 }

  gap = { x: regionCardDescription.width + 0.5 }

  getHoverTransform() {
    return ['translateZ(10em)', 'scale(2)']
  }
}

export const regionLocator = new RegionLocator()