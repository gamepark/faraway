import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { Region } from '../../cards/Region'
import { RegionQuests } from '../../cards/RegionQuests'
import { Sanctuary } from '../../cards/Sanctuary'
import { SanctuaryQuests } from '../../cards/SanctuaryQuests'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { Memory } from '../Memory'

class ScoreLookupRules extends MaterialRulesPart {}

/**
 * Read a region card's score. Prefers the value frozen by {@link ScoringRule#lockScoresAtX}
 * (stored in {@link Memory.RegionScoresByIndex}) so cards already resolved during scoring
 * keep the score they earned at that moment — necessary because subsequent sacrifices
 * change the visible-sanctuary set and would otherwise retroactively shift live scores.
 *
 * Falls back to a live computation for cards that haven't been locked yet (the current
 * scoring card, or any consumer rendering outside the scoring loop).
 */
export const getRegionCardScore = (game: MaterialGame, index: number): number => {
  const helper = new ScoreLookupRules(game)
  const locked = helper.remind<Record<number, number>>(Memory.RegionScoresByIndex)
  if (locked && index in locked) return locked[index]
  const item = helper.material(MaterialType.Region).getItem<Region>(index)
  if (item?.location.player === undefined) return 0
  const quest = RegionQuests[item.id]
  if (!quest) return 0
  return quest.getTotalScore(game, index, MaterialType.Region, item.location.player as PlayerId)
}

export class ScoreHelper extends MaterialRulesPart {

  constructor(game: MaterialGame, readonly player: PlayerId) {
    super(game)
  }

  get score() {
    return this.regionScore + this.sanctuaryScore
  }

  get sanctuaryScore() {
    let score = 0
    const sanctuariesIndexes = this.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryLine).player(this.player).getIndexes()
    for (const index of sanctuariesIndexes) {
      const item = this.material(MaterialType.Sanctuary).getItem<Sanctuary>(index)
      const quest = SanctuaryQuests[item.id]
      if (!quest) continue
      score += quest.getTotalScore(this.game, index, MaterialType.Sanctuary, this.player)
    }

    return score
  }

  get regionScore() {
    let score = 0
    const regionIndexes = this.material(MaterialType.Region).location(LocationType.PlayerRegionLine).player(this.player).getIndexes()
    for (const index of regionIndexes) {
      score += getRegionCardScore(this.game, index)
    }
    return score
  }
}
