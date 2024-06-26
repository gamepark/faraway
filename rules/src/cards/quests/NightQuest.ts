import { MaterialItem } from '@gamepark/rules-api'
import sum from 'lodash/sum'
import { Regions } from '../Regions'
import { Sanctuaries } from '../Sanctuaries'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class NightQuest extends Quest {
  type = QuestType.Night

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const nightRegions = regions.map((r) => Regions[r.id]?.night ?? 0)
    const nightSanctuaries = sanctuaries.map((r) => Sanctuaries[r.id]?.night ?? 0)
    return this.points * (sum(nightRegions) + sum(nightSanctuaries))
  }
}