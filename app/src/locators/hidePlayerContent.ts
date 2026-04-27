import { ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { getViewPlayer } from './panelCoordinates'

/**
 * True when an item belongs to a player other than the viewed one.
 * Used to implement `hide()` on per-player locators — the framework removes the item
 * from the DOM, avoiding ugly teleports when the view changes.
 */
export const isNotViewedPlayerItem = (item: MaterialItem, context: ItemContext): boolean => {
  if (item.location.player === undefined) return false
  return item.location.player !== getViewPlayer(context)
}
