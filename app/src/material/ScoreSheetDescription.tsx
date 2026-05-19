import { Region } from '@gamepark/faraway/cards/Region'
import { RegionQuests } from '@gamepark/faraway/cards/RegionQuests'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { getRegionCardScore, ScoreHelper } from '@gamepark/faraway/rules/helper/ScoreHelper'
import { Memory } from '@gamepark/faraway/rules/Memory'
import { FlatMaterialDescription, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import ScoreSheet from '../images/ScoreSheet.jpg'
import { ScoreSheetHelp } from './help/ScoreSheetHelp'


export class ScoreSheetDescription extends FlatMaterialDescription {
  width = 7.2
  height = 9.9

  image = ScoreSheet

  // Override `getStaticItems` (not the simpler `staticItem` field) so we can embed the
  // current scoring state into the item's location. StaticItemDisplay memoises on item
  // deep-equality and does NOT consult the Locator's `getPositionDependencies`, so without
  // changing the item itself the score sheet stays frozen on the first render and the
  // rows never appear during scoring. The extra `x` is ignored by ScoreSheetLocator's
  // fixed `getLocationCoordinates`, so it's purely a cache-buster.
  getStaticItems(context: MaterialContext): MaterialItem[] {
    const currentX = context.rules.remind(Memory.CurrentScoringX) as number | undefined
    const hiddenRegions = context.rules.material(MaterialType.Region)
      .location(LocationType.PlayerRegionLine)
      .rotation(r => !r)
      .length
    const tick = currentX === undefined
      ? (context.rules.isOver() ? -1 : -2)
      : currentX * 100 + hiddenRegions
    return [{ location: { type: LocationType.ScoreSheet, x: tick } }]
  }

  /**
   * Populate boxes incrementally as scoring reveals cards (same gating logic as the
   * per-card bubbles): each region row only shows when its card is face-up, and the
   * sanctuary/total rows only show once every region is revealed.
   */
  getLocations(_item: MaterialItem, context: ItemContext) {
    const rules = context.rules as FarawayRules
    const currentX = rules.game.memory?.[Memory.CurrentScoringX] as number | undefined
    const isOver = rules.isOver()
    if (currentX === undefined && !isOver) return []

    const locations: Location[] = []

    // Player avatar header — always visible during scoring.
    for (const player of rules.players) {
      locations.push({
        type: LocationType.ScoreSheetBox,
        id: player,
        parent: 0,
        x: player,
        y: 0
      })
    }

    // Region rows: show only cards scoring has already passed through. During iteration,
    // currentScoringX walks 7 → 0; a card has been resolved iff its x >= currentScoringX.
    // We also wait until every card at that x is face-up so the row pops in sync with the
    // per-card bubble (same gate as ScoringIndicator). Starry-Skies/digit-matched cards
    // that stayed face-up are intentionally NOT shown ahead of time — they appear when
    // scoring reaches their x, like every other row.
    const regions = rules.material(MaterialType.Region).location(LocationType.PlayerRegionLine).sort(item => -item.location.x!)
    const allAtXRevealed = new Map<number, boolean>()
    const isXRevealed = (x: number): boolean => {
      const cached = allAtXRevealed.get(x)
      if (cached !== undefined) return cached
      const result = rules.material(MaterialType.Region)
        .location(LocationType.PlayerRegionLine)
        .location(loc => loc.x === x)
        .getItems()
        .every(i => i.location.rotation === true && i.id !== undefined)
      allAtXRevealed.set(x, result)
      return result
    }
    for (const index of regions.getIndexes()) {
      const region = regions.getItem<Region>(index)!
      if (region.location.x === undefined || region.id === undefined) continue
      // Has scoring reached this x yet?
      if (currentX !== undefined && region.location.x < currentX) continue
      if (!isXRevealed(region.location.x)) continue
      const regionQuest = RegionQuests[region.id]
      locations.push({
        type: LocationType.ScoreSheetBox,
        id: regionQuest ? getRegionCardScore(rules.game, index) : '/',
        parent: 0,
        x: region.location.player,
        y: 8 - region.location.x
      })
    }

    // Sanctuary + total rows: only once the game is over — there's a ~2.5s window between
    // the final reveal and the actual end-game (the trailing scoring wait), and we'd rather
    // wait for that to settle so the recap reads as a final summary.
    if (isOver) {
      for (const player of rules.players) {
        locations.push({
          type: LocationType.ScoreSheetBox,
          id: new ScoreHelper(rules.game, player).sanctuaryScore,
          parent: 0,
          x: player,
          y: 9
        })
        locations.push({
          type: LocationType.ScoreSheetBox,
          id: new ScoreHelper(rules.game, player).score,
          parent: 0,
          x: player,
          y: 10
        })
      }
    }

    return locations
  }

  help = ScoreSheetHelp
}

export const scoreSheetDescription = new ScoreSheetDescription()