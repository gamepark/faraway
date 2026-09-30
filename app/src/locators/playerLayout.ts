import { regionCardDescription } from '../material/RegionCardDescription'
import { spiritCardHeight, spiritCardWidth } from '../panels/PanelConstants'
import { MaterialContext } from '@gamepark/react-game'
import { isBeyondTheVeil } from '../extension/isBeyondTheVeil'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'

/**
 * Central layout constants for the viewed player's area.
 *
 *                    [ SANCTUARY GRID ]   [ REGION GRID ]
 *                    ← columns extend     columns extend →
 *
 * Grids share the same Y. Sanctuary grid is anchored on the LEFT edge of the
 * region grid. Hands sit below, centered on their respective grid.
 */

const CARD_GAP = 0.5

// --- Region grid (4 columns × 2 rows, extends rightward) ---
export const REGION_ANCHOR_X = -2
export const REGION_Y = 13
export const REGION_LINE_SIZE = 4
export const REGION_COLUMN_GAP = regionCardDescription.width + CARD_GAP

const REGION_LEFT_EDGE = REGION_ANCHOR_X - regionCardDescription.width / 2
const REGION_RIGHT_EDGE = REGION_ANCHOR_X + (REGION_LINE_SIZE - 1) * REGION_COLUMN_GAP + regionCardDescription.width / 2

export const REGION_CENTER_X = (REGION_LEFT_EDGE + REGION_RIGHT_EDGE) / 2

// --- Sanctuary grid (2 rows per column, columns extend leftward from region's left edge) ---
export const SANCTUARY_Y = REGION_Y
export const SANCTUARY_MAX_LINES = 3
export const SANCTUARY_COLUMN_GAP = -(sanctuaryCardDescription.width + CARD_GAP)
export const SANCTUARY_ANCHOR_X = REGION_LEFT_EDGE - CARD_GAP - sanctuaryCardDescription.width / 2

const SANCTUARY_LINE_SIZE = 2 // FlexLocator default — 2 items stacked per column
const SANCTUARY_LEFTMOST = SANCTUARY_ANCHOR_X + (SANCTUARY_MAX_LINES - 1) * SANCTUARY_COLUMN_GAP
export const SANCTUARY_CENTER_X = (SANCTUARY_ANCHOR_X + SANCTUARY_LEFTMOST) / 2

// Full zone extent — used by the drop-area description to render a single zone
// covering every sanctuary slot of the viewed player.
export const SANCTUARY_ZONE_WIDTH = SANCTUARY_MAX_LINES * sanctuaryCardDescription.width + (SANCTUARY_MAX_LINES - 1) * CARD_GAP
export const SANCTUARY_ZONE_HEIGHT = SANCTUARY_LINE_SIZE * sanctuaryCardDescription.height + (SANCTUARY_LINE_SIZE - 1) * CARD_GAP + 0.2
export const SANCTUARY_ZONE_CENTER_Y = SANCTUARY_Y + (sanctuaryCardDescription.height + CARD_GAP) / 2

// --- Hands (below the grids) ---
export const HAND_Y = 29

// --- Beyond the Veil ---
// Spirits are slid under the Region cards, their top and bottom sticking out: the region rows need more room,
// and the hands move down a little to make it.
export const SPIRIT_REGION_ROW_GAP = spiritCardHeight + 0.5
export const SPIRIT_REGION_COLUMN_GAP = spiritCardWidth + 0.45
// First row low enough for the top of the Spirits to clear the river, second row high enough for their bottom to clear the hands
export const SPIRIT_REGION_Y = 13.3
export const SPIRIT_HAND_Y = 33.4

export const getRegionY = (context: MaterialContext) => isBeyondTheVeil(context.rules) ? SPIRIT_REGION_Y : REGION_Y
export const getRegionRowGap = (context: MaterialContext) => isBeyondTheVeil(context.rules) ? SPIRIT_REGION_ROW_GAP : REGION_COLUMN_GAP
export const getRegionColumnGap = (context: MaterialContext) => isBeyondTheVeil(context.rules) ? SPIRIT_REGION_COLUMN_GAP : REGION_COLUMN_GAP
export const getHandY = (context: MaterialContext) => isBeyondTheVeil(context.rules) ? SPIRIT_HAND_Y : HAND_Y

/** Center of the region grid, where the region hand is centered: the grid is wider with Beyond the Veil. */
export const getRegionCenterX = (context: MaterialContext) => {
  const gap = getRegionColumnGap(context)
  return (REGION_LEFT_EDGE + REGION_ANCHOR_X + (REGION_LINE_SIZE - 1) * gap + regionCardDescription.width / 2) / 2
}
