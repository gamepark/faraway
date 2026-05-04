import { tableXMax, tableXMin, tableYMax, tableYMin } from '../../panels/PanelConstants';

/**
 * Fixed 2-player table size — single-player-view mode keeps the table the same
 * regardless of how many players are in the game.
 */
export const getTableSize = (): { xMin: number; xMax: number; yMin: number; yMax: number } => ({
  xMin: tableXMin, xMax: tableXMax, yMin: tableYMin, yMax: tableYMax
})
