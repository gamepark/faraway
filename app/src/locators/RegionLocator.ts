import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { getRegionLinePosition, regionLineGapX } from '../panels/PanelConstants'

class RegionLocator extends ListLocator {
  gap = { x: regionLineGapX }

  getCoordinates(_location: Location, context: MaterialContext) {
    return getRegionLinePosition(context.rules.players.length)
  }

  getHoverTransform() {
    // Scaled 2× on hover (14em tall). Translate percentages resolve against the un-transformed
    // box (7em), so 50% = 3.5em — enough to push the scaled top edge back inside the table.
    return ['translateZ(10em)', 'translateY(50%)', 'scale(2)']
  }
}

export const regionLocator = new RegionLocator()
