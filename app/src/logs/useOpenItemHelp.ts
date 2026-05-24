import { MaterialItem, MaterialMoveBuilder } from '@gamepark/rules-api'

const { displayMaterialHelp } = MaterialMoveBuilder

/** Build the `displayMaterialHelp` move that opens the help dialog
 *  for a given material item. Returned as a plain move object so log
 *  components can hand it to <PlayMoveButton move={...} transient/>
 *  (the framework drives the play() call + transient lifecycle).
 *
 *  Returns `undefined` when the item is missing — let the caller skip
 *  rendering the interactive wrapper (e.g. for cards whose id is
 *  hidden by a SecretMaterialRules strategy at the moment of the log).
 */
export const buildOpenItemHelpMove = (
  itemType: number,
  item: MaterialItem | undefined,
  itemIndex?: number,
  displayIndex?: number
) => {
  if (!item) return undefined
  return displayMaterialHelp(itemType, item, itemIndex, displayIndex)
}
