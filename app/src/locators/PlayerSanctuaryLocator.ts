import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { Memory } from '@gamepark/faraway/rules/Memory'
import { FlexLocator, isItemContext, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'
import { PlayerSanctuaryAreaDescription } from './description/PlayerSanctuaryAreaDescription'
import { isNotViewedPlayerItem } from './hidePlayerContent'
import { getViewPlayer } from './panelCoordinates'
import { SANCTUARY_ANCHOR_X, SANCTUARY_COLUMN_GAP, SANCTUARY_MAX_LINES, SANCTUARY_Y } from './playerLayout'

export class PlayerSanctuaryLocator extends FlexLocator {
  gap = { y: sanctuaryCardDescription.height + 0.8 }
  lineGap = { x: SANCTUARY_COLUMN_GAP }
  maxLines = SANCTUARY_MAX_LINES

  coordinates = { x: SANCTUARY_ANCHOR_X, y: SANCTUARY_Y }

  getCoordinates(_location: Location, context: MaterialContext) {
    if (isItemContext(context)) {
      return { x: SANCTUARY_ANCHOR_X, y: SANCTUARY_Y }
    }

    return { x: SANCTUARY_ANCHOR_X, y: SANCTUARY_Y }

  }

  locationDescription = new PlayerSanctuaryAreaDescription()

  hide(item: MaterialItem, context: ItemContext): boolean {
    return isNotViewedPlayerItem(item, context)
  }

  getLocations(context: MaterialContext) {
    const viewed = getViewPlayer(context)
    if (viewed === undefined) return []
    // Single location covering the whole sanctuary zone — FlexLocator still
    // positions individual items via its grid formula based on list order.
    return [{ type: LocationType.PlayerSanctuaryLine, player: viewed }]
  }

  // Force a re-render of every sanctuary card when the scoring x changes, the game
  // ends, or the count of still-hidden regions changes. SanctuaryCardDescription's
  // getLocations gates the score bubble on those three signals; without this hook
  // DraggableMaterial's memo keeps the previous result and the score bubbles never
  // appear until the user refreshes the page.
  getPositionDependencies(_location: Location, context: MaterialContext) {
    return {
      currentScoringX: context.rules.remind(Memory.CurrentScoringX) ?? null,
      isOver: context.rules.isOver(),
      hiddenRegions: context.rules.material(MaterialType.Region)
        .location(LocationType.PlayerRegionLine)
        .rotation(r => !r)
        .length
    }
  }

  getHoverTransform() {
    return ['translateZ(10em)', 'scale(2)']
  }
}

export const playerSanctuaryLocator = new PlayerSanctuaryLocator()
