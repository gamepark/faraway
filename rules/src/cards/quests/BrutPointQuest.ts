import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class BrutPointQuest extends Quest {
  type = QuestType.BrutPoints

  getScore(): number | undefined {
    return this.points
  }
}