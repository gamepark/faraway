import { ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { getRegionLinePosition, regionLineGapX, tableXMax } from '../panels/PanelConstants'

// Half-size of a region card on 2× hover. Bord droit du hover = centre + this.
const CARD_HOVER_HALF = 7

class RegionLocator extends ListLocator {
  gap = { x: regionLineGapX }

  getCoordinates(_location: Location, context: MaterialContext) {
    return getRegionLinePosition(context.rules.players.length)
  }

  getHoverTransform(item: MaterialItem, context: ItemContext) {
    // Scaled 2× on hover (14em tall). Translate percentages resolve against the un-transformed
    // box (7em), so 50% = 3.5em — enough to push the scaled top edge back inside the table.
    const transforms = ['translateZ(10em)', 'translateY(50%)', 'scale(2)']
    // Only shift left when the hovered card would actually overflow the
    // table's right edge. Avoids decentering cards in player counts where
    // the river still has room (e.g. 3-player layouts).
    const x = item.location.x
    if (typeof x === 'number') {
      const cardCenterX = getRegionLinePosition(context.rules.players.length).x + x * regionLineGapX
      const overflow = (cardCenterX + CARD_HOVER_HALF) - tableXMax
      if (overflow > 0) {
        transforms.push(`translateX(-${overflow}em)`)
      }
    }
    return transforms
  }
}

export const regionLocator = new RegionLocator()
