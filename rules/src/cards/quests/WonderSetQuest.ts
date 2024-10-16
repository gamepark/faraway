import { MaterialItem } from '@gamepark/rules-api'
import minBy from 'lodash/minBy'
import { wonders } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class WonderSetQuest extends Quest {
  type = QuestType.WonderSet

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    return minBy(wonders, wonder => this.getPlayerWonderCount(regions, sanctuaries, wonder))! * this.points
  }
}