import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { MaterialRules } from '@gamepark/rules-api'

/**
 * Beyond the Veil is played when the Spirit cards exist in the game (hidden cards in the deck are counted too).
 */
export const isBeyondTheVeil = (rules?: MaterialRules): boolean => !!rules?.game.items[MaterialType.Spirit]?.length
