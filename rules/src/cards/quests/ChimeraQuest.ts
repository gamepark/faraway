import { MaterialItem } from '@gamepark/rules-api'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class ChimeraQuest extends Quest {
  type = QuestType.Chimera

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const chimeras = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Chimera)
    return chimeras * this.points
  }
}