import { baseGameRegions, expansion1Regions, starrySkiesRegions } from '@gamepark/faraway/cards/Region'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { useRules } from '@gamepark/react-game'
import { useMemo } from 'react'

export type ActiveExtensions = {
  expansion1: boolean
  starrySkies: boolean
}

/**
 * Detect which extensions are in play by the TOTAL number of Region cards in the game.
 * We can't rely on card IDs because `hideItemId` masks deck cards client-side; counting
 * items always works regardless of visibility.
 *
 * Possible totals (delta from base game):
 *   - 0          → no extension
 *   - exp1       → expansion1 only
 *   - starry     → starrySkies only
 *   - exp1+starry → both
 */
export const useActiveExtensions = (): ActiveExtensions => {
  const rules = useRules<FarawayRules>()
  return useMemo(() => {
    if (!rules) return { expansion1: false, starrySkies: false }
    const delta = rules.material(MaterialType.Region).length - baseGameRegions.length
    const exp1 = expansion1Regions.length
    const starry = starrySkiesRegions.length
    return {
      expansion1: delta === exp1 || delta === exp1 + starry,
      starrySkies: delta === starry || delta === exp1 + starry
    }
  }, [rules])
}
