import { ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { getRegionLinePosition, regionLineGapX } from '../panels/PanelConstants'

class RegionLocator extends ListLocator {
  gap = { x: regionLineGapX }

  getCoordinates(_location: Location, context: MaterialContext) {
    return getRegionLinePosition(context.rules.players.length)
  }

  getHoverTransform(item: MaterialItem, context: ItemContext) {
    // Scaled 2× on hover (14em tall). Translate percentages resolve against the un-transformed
    // box (7em), so 50% = 3.5em — enough to push the scaled top edge back inside the table.
    const transforms = ['translateZ(10em)', 'translateY(50%)', 'scale(2)']
    // Last card in the river (index = players) sits at the right edge — its
    // 2× hover overflow falls off-screen. Shift it left by 25% of its own
    // box (= ~1.75em on a 7em card) so the hovered card stays inside the
    // table.
    const lastIndex = context.rules.players.length
    if (item.location.x === lastIndex) {
      transforms.push('translateX(-25%)')
    }
    return transforms
  }
}

export const regionLocator = new RegionLocator()
