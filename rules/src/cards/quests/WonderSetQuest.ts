import { MaterialItem } from '@gamepark/rules-api'
import { wonders } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class WonderSetQuest extends Quest {
  type = QuestType.WonderSet

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    return Math.min(...wonders.map(wonder => this.getPlayerWonderCount(regions, sanctuaries, wonder))) * this.points
  }
}