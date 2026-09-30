// Panel layout constants — values in TABLE em
// Used by PlayerPanels.tsx AND OnPlayerPanelLocator.ts
//
// Beyond the Veil needs more room: the Spirits are bigger than the Region cards they are slid under, so the region rows are
// further apart (taller table), and the Spirit deck + the 2 available Spirits take a column of their own on the left of the
// table (wider table). Every position that moves is a function of `beyondTheVeil`; without the extension nothing changes.

export const tableXMin = -32
export const tableXMax = 37.5
export const tableYMin = -0
export const tableYMax = 35

/** Extra room taken on the left and at the bottom by Beyond the Veil */
export const spiritTableExtraLeft = 8
export const spiritTableExtraBottom = 3

export const getTableXMin = (beyondTheVeil: boolean) => beyondTheVeil ? tableXMin - spiritTableExtraLeft : tableXMin
export const getTableYMax = (beyondTheVeil: boolean) => beyondTheVeil ? tableYMax + spiritTableExtraBottom : tableYMax

export const getTableSize = (beyondTheVeil: boolean) => ({
  xMin: getTableXMin(beyondTheVeil), xMax: tableXMax, yMin: tableYMin, yMax: getTableYMax(beyondTheVeil)
})

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

// --- Beyond the Veil: the Spirit cards are 75.2 x 106.3 mm, against 70 x 70 mm for a Region card ---
export const spiritCardWidth = 7.52
export const spiritCardHeight = 10.63
// The artwork is bigger than the card: it carries the 1 mm margin of the press file plus the baked drop shadow
// (transparent images get no CSS shadow from the framework). The card itself stays centered in it.
export const spiritWidth = 7.92
export const spiritHeight = 11.03

/** Column of the Spirit deck and of the 2 available Spirits, flush with the left edge of the table */
export const spiritColumnX = getTableXMin(true) + 0.5 + spiritCardWidth / 2
/** Column of the decks and of the score sheet, right of the Spirits */
export const spiritDeckColumnX = spiritColumnX + spiritCardWidth / 2 + 0.5 + 3.5

/**
 * Dynamic deck positions: with Beyond the Veil, or at 5 players and more, they are stacked vertically to save horizontal room.
 * Region deck takes the Sanctuary's default slot; Sanctuary deck drops below.
 */
export function getSanctuaryDeckPosition(playerCount: number, beyondTheVeil = false): { x: number; y: number } {
  if (beyondTheVeil) return { x: spiritDeckColumnX, y: deckRowY + 8 }
  if (playerCount >= 5) return { x: sanctuaryDeckX, y: deckRowY + 7.5 }
  return { x: sanctuaryDeckX, y: deckRowY }
}

export function getRegionDeckPosition(playerCount: number, beyondTheVeil = false): { x: number; y: number } {
  if (beyondTheVeil) return { x: spiritDeckColumnX, y: deckRowY }
  if (playerCount >= 5) return { x: sanctuaryDeckX + 1, y: deckRowY }
  return { x: regionDeckX, y: deckRowY }
}

// Region line ("rivière") starts just right of the region deck; cards extend horizontally.
export const regionLineGapX = 7.5
// Distance between the region deck's RIGHT edge and the first river card center.
// = card half-width (3.5) + 0.5 em gap → card just next to the deck, not overlapping.
export const regionLineOffsetFromDeck = 3.5 + 0.5 + 3.5

export function getRegionLinePosition(playerCount: number, beyondTheVeil = false): { x: number; y: number } {
  const deck = getRegionDeckPosition(playerCount, beyondTheVeil)
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

/** The Spirit deck sits on top of the column, then the 2 available Spirits below it. */
export function getSpiritDeckPosition(): { x: number; y: number } {
  return { x: spiritColumnX, y: tableYMin + 0.6 + spiritCardHeight / 2 }
}

export function getAvailableSpiritsPosition(): { x: number; y: number } {
  return { x: spiritColumnX, y: getSpiritDeckPosition().y + spiritCardHeight + 0.5 }
}

/** Gap between the 2 available Spirits, stacked under the deck */
export const availableSpiritGapY = spiritCardHeight + 0.5

// ScoreSheet: card size ~7.2 × 9.9 em, with 0.5 em margin from the table edges.
export const scoreSheetWidth = 7.2
export const scoreSheetHeight = 9.9
export const scoreSheetMargin = 0.5
export const scoreSheetX = tableXMin + scoreSheetWidth / 2 + scoreSheetMargin
export const scoreSheetY = tableYMax - scoreSheetHeight / 2 - scoreSheetMargin

/** With Beyond the Veil the score sheet moves to the deck column, at the bottom of the table. */
export function getScoreSheetPosition(beyondTheVeil: boolean): { x: number; y: number } {
  if (!beyondTheVeil) return { x: scoreSheetX, y: scoreSheetY }
  return { x: spiritDeckColumnX, y: getTableYMax(true) - scoreSheetHeight / 2 - scoreSheetMargin }
}

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
export function getPanelPosition(panelIndex: number, totalPlayers: number, beyondTheVeil = false): { x: number; y: number } {
  const panelHeight = getPanelHeight(totalPlayers)
  const panelWidth = getPanelWidth(totalPlayers)
  const step = panelHeight + panelGapTable
  const x = tableXMax - panelMargin - panelWidth / 2
  const y = getTableYMax(beyondTheVeil) - panelBottomMargin - panelHeight / 2 - (totalPlayers - 1 - panelIndex) * step
  return { x, y }
}

/**
 * Animation staging spot, LEFT of the panel (panels are on the right edge, so "inside"
 * the panel = toward the table center).
 *
 * @param offset Extra distance beyond the panel edge (default 0 = flush against the panel).
 */
export function getPanelStagingPosition(panelIndex: number, totalPlayers: number, offset = 0, beyondTheVeil = false): { x: number; y: number } {
  const { x, y } = getPanelPosition(panelIndex, totalPlayers, beyondTheVeil)
  return { x: x - getPanelWidth(totalPlayers) / 2 - offset, y }
}
