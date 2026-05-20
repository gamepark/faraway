// Panel layout constants — values in TABLE em
// Used by PlayerPanels.tsx AND OnPlayerPanelLocator.ts

export const tableXMin = -32
export const tableXMax = 37.5
export const tableYMin = -0
export const tableYMax = 35

export const tableSize = { xMin: tableXMin, xMax: tableXMax, yMin: tableYMin, yMax: tableYMax }

// Panel intrinsic dimensions (in panel font-em — actual render multiplied by the scale)
export const panelEmWidth = 28
export const panelEmHeight = 8.3

// Panel layout (in TABLE em — independent of the panel scale)
export const panelMargin = 0.3
export const panelBottomMargin = 0.3
export const panelGapTable = 0.6
// Horizontal shift applied to the whole panel strip (to clear the shared zone on the left).
export const panelTranslateX = 5

// Max scale regardless of player count (so 2P panels don't balloon)
export const panelMaxScale = 0.3

// --- Shared zone (horizontal row anchored at top-left of the table) ---
// Card size 7×7, 0.5em gap, 0.5em margin from the table edge.
export const deckRowY = tableYMin + 4 // flush with top edge

export const sanctuaryDeckX = tableXMin + 3.5 // flush with left edge
export const regionDeckX = sanctuaryDeckX + 7

/**
 * Dynamic deck positions: at 7 players we stack them vertically to save horizontal room.
 * Region deck takes the Sanctuary's default slot; Sanctuary deck drops below.
 */
export function getSanctuaryDeckPosition(playerCount: number): { x: number; y: number } {
  if (playerCount >= 5) return { x: sanctuaryDeckX, y: deckRowY + 7.5 }
  return { x: sanctuaryDeckX, y: deckRowY }
}

export function getRegionDeckPosition(playerCount: number): { x: number; y: number } {
  if (playerCount >= 5) return { x: sanctuaryDeckX + 1, y: deckRowY }
  return { x: regionDeckX, y: deckRowY }
}

// Region line ("rivière") starts just right of the region deck; cards extend horizontally.
export const regionLineGapX = 7.5
// Distance between the region deck's RIGHT edge and the first river card center.
// = card half-width (3.5) + 0.5 em gap → card just next to the deck, not overlapping.
export const regionLineOffsetFromDeck = 3.5 + 0.5 + 3.5

export function getRegionLinePosition(playerCount: number): { x: number; y: number } {
  const deck = getRegionDeckPosition(playerCount)
  return { x: deck.x + regionLineOffsetFromDeck + 1, y: deck.y }
}

// Region discard: scale 0.7, position depends on player count.
export const regionDiscardScale = 0.7
export const regionDiscardCardHalf = 3.5 * regionDiscardScale // visual half-size
// Default slot further right of the river (pushed outside by large player counts).
export const regionDiscardX = regionDeckX + regionLineOffsetFromDeck + 7.5 * 5

export function getRegionDiscardPosition(playerCount: number): { x: number; y: number } {
  if (playerCount === 7) {
    return { x: tableXMax - regionDiscardCardHalf - 1, y: tableYMin + regionDiscardCardHalf + 1 + 7 }
  }
  return { x: tableXMax - regionDiscardCardHalf - 0.5, y: tableYMin + regionDiscardCardHalf + 0.5 }
}

// ScoreSheet: bottom-left (card size ~7.2 × 9.9 em, with 0.5 em margin from table edges)
export const scoreSheetX = tableXMin + 7.2 / 2 + 0.5
export const scoreSheetY = tableYMax - 9.9 / 2 - 0.5

/**
 * Scale that makes all panels fit inside the table width, clamped to {@link panelMaxScale}.
 */
export function getPanelScale(playerCount: number): number {
  const available = (tableXMax - tableXMin) - 2 * panelMargin - (playerCount - 1) * panelGapTable
  const perPanel = available / playerCount
  return Math.min(panelMaxScale, perPanel / panelEmWidth)
}

export const getPanelWidth = (playerCount: number): number => panelEmWidth * getPanelScale(playerCount)
export const getPanelHeight = (playerCount: number): number => panelEmHeight * getPanelScale(playerCount)

// Panels render as a vertical column pinned to the RIGHT edge of the table, always
// anchored at the bottom (matches PlayerPanels.tsx — `justify-content: flex-end`).

/**
 * Center coordinates (table em) of a panel, given its index in the "sorted-from-me"
 * list and the total player count. Matches the flex column rendered in PlayerPanels.tsx.
 */
export function getPanelPosition(panelIndex: number, totalPlayers: number): { x: number; y: number } {
  const panelHeight = getPanelHeight(totalPlayers)
  const panelWidth = getPanelWidth(totalPlayers)
  const step = panelHeight + panelGapTable
  const x = tableXMax - panelMargin - panelWidth / 2
  const y = tableYMax - panelBottomMargin - panelHeight / 2 - (totalPlayers - 1 - panelIndex) * step
  return { x, y }
}

/**
 * Animation staging spot, LEFT of the panel (panels are on the right edge, so "inside"
 * the panel = toward the table center).
 *
 * @param offset Extra distance beyond the panel edge (default 0 = flush against the panel).
 */
export function getPanelStagingPosition(panelIndex: number, totalPlayers: number, offset = 0): { x: number; y: number } {
  const { x, y } = getPanelPosition(panelIndex, totalPlayers)
  return { x: x - getPanelWidth(totalPlayers) / 2 - offset, y }
}
