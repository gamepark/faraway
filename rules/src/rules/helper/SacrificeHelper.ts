import { SacrificeQuest } from '../../cards/quests/SacrificeQuest'
import { Region } from '../../cards/Region'
import { RegionQuests } from '../../cards/RegionQuests'

export type SacrificeOption = {
  /** The region card index in the Region material. */
  regionIndex: number
  /** The region card id (for diagnostics / UI). */
  regionId: Region
  /** How many sanctuaries the player must discard to activate. */
  sanctuariesToSacrifice: number
  /** Points awarded if activated. */
  points: number
}

/**
 * Pure, side-effect-free helpers for the sacrifice step. Kept separate from the rule
 * so they can be unit-tested without spinning up a MaterialGame.
 */
export const SacrificeHelper = {
  /**
   * From a player's region line and sanctuary line, list the SacrificeQuest cards
   * the player COULD activate — i.e. they have at least `sanctuariesToSacrifice`
   * sanctuaries available right now. The rule decides whether they actually do.
   */
  getEligibleSacrifices(
    playerRegions: Array<{ index: number; id: Region }>,
    sanctuaryCount: number
  ): SacrificeOption[] {
    const options: SacrificeOption[] = []
    for (const { index, id } of playerRegions) {
      const quest = RegionQuests[id]
      if (!(quest instanceof SacrificeQuest)) continue
      if (sanctuaryCount < quest.sanctuariesToSacrifice) continue
      options.push({
        regionIndex: index,
        regionId: id,
        sanctuariesToSacrifice: quest.sanctuariesToSacrifice,
        points: quest.points
      })
    }
    return options
  }
}
