import { LocationType } from '@gamepark/faraway/material/LocationType'
import { Memory } from '@gamepark/faraway/rules/Memory'
import { FlexLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { PlayerRegionAreaDescription } from './description/PlayerRegionAreaDescription'
import { isNotViewedPlayerItem } from './hidePlayerContent'
import { getViewPlayer } from './panelCoordinates'
import { REGION_ANCHOR_X, REGION_COLUMN_GAP, REGION_LINE_SIZE, REGION_Y } from './playerLayout'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { isEqual } from 'es-toolkit'

export class PlayerRegionLocator extends FlexLocator {
  lineSize = REGION_LINE_SIZE
  gap = { x: REGION_COLUMN_GAP }
  lineGap = { y: REGION_COLUMN_GAP }

  coordinates = { x: REGION_ANCHOR_X, y: REGION_Y }

  locationDescription = new PlayerRegionAreaDescription()

  hide(item: MaterialItem, context: ItemContext): boolean {
    return isNotViewedPlayerItem(item, context)
  }

  getLocations(context: MaterialContext) {
    const viewed = getViewPlayer(context)
    if (viewed === undefined) return []
    return Array.from(Array(8))
      .flatMap((_, x) => {
        const location = {
          type: LocationType.PlayerRegionLine,
          player: viewed,
          x
        };
        if (context.rules.material(MaterialType.Region).location((l) => isEqual(l, location)).length) return []
        return [location]
      })
  }

  // Force a re-render of every region card when the scoring x changes (or game ends),
  // so RegionCardDescription.getItemExtraCss (yellow halo) and getLocations (per-card
  // score bubble) get re-evaluated. Without this, DraggableMaterial's memo keeps the
  // halo stuck on the old card and the score bubbles never appear during scoring.
  getPositionDependencies(_location: Location, context: MaterialContext) {
    return { currentScoringX: context.rules.remind(Memory.CurrentScoringX) ?? null, isOver: context.rules.isOver() }
  }

  getHoverTransform(item: MaterialItem) {
    return item.id !== undefined ? ['translateZ(10em)', 'scale(2)'] : []
  }
}

export const playerRegionLocator = new PlayerRegionLocator()
