import { Quest } from '../../cards/quests/Quest'
import { RegionQuests } from '../../cards/RegionQuests'
import { SanctuaryQuests } from '../../cards/SanctuaryQuests'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'

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
    for (let index of sanctuariesIndexes) {
      const item = this.material(MaterialType.Sanctuary).getItem(index)
      const quest: Quest = SanctuaryQuests[item.id]
      if (!quest) continue
      score += quest.getTotalScore(this.game, index, MaterialType.Sanctuary, this.player)
    }

    return score
  }

  get regionScore() {
    let score = 0
    const regionIndexes = this.material(MaterialType.Region).location(LocationType.PlayerRegionLine).player(this.player).getIndexes()
    for (let index of regionIndexes) {
      const item = this.material(MaterialType.Region).getItem(index)
      const quest: Quest = RegionQuests[item.id]
      if (!quest) continue
      score += quest.getTotalScore(this.game, index, MaterialType.Region, this.player)
    }

    return score
  }
}