import { MaterialItem } from '@gamepark/rules-api'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class ThistleQuest extends Quest {
  type = QuestType.Thistle

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const chimeras = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Thistle)
    return chimeras * this.points
  }
}