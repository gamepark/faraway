import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Region } from '../Region'
import { Sanctuary } from '../Sanctuary'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

/**
 * Quest from the Starry Skies extension: score `pointsPerWonder` for each instance of any
 * wonder in `scoringWonders`, summed across all visible regions and sanctuaries.
 *
 * Example: `new MultiWonderSumQuest(1, [Wonder.Chimera, Wonder.Thistle])` →
 * score = 1 × (totalChimeras + totalThistles).
 */
export class MultiWonderSumQuest extends Quest {
  type = QuestType.MultiWonderSum

  constructor(readonly pointsPerWonder: number, readonly scoringWonders: Wonder[]) {
    super(pointsPerWonder)
  }

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    return this.scoringWonders.reduce(
      (total, wonder) => total + this.pointsPerWonder * this.getPlayerWonderCount(regions, sanctuaries, wonder),
      0
    )
  }
}
