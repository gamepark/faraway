import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { getRegionLinePosition, regionLineGapX } from '../panels/PanelConstants'

class RegionLocator extends ListLocator {
  gap = { x: regionLineGapX }

  getCoordinates(_location: Location, context: MaterialContext) {
    return getRegionLinePosition(context.rules.players.length)
  }

  getHoverTransform() {
    return ['translateZ(10em)', 'scale(2)']
  }
}

export const regionLocator = new RegionLocator()
