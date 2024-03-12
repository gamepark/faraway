import { MaterialItem } from '@gamepark/rules-api'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class RockQuest extends Quest {
  type = QuestType.Rock

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const chimeras = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Rock)
    return chimeras * this.points
  }
}