import { MaterialItem } from '@gamepark/rules-api'
import sum from 'lodash/sum'
import { Regions } from '../Regions'
import { Sanctuaries } from '../Sanctuaries'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class ClueQuest extends Quest {
  type = QuestType.Clue

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const regionClues = regions.map((r) => Regions[r.id]?.clue ?? 0)
    const sanctuaryClues = sanctuaries.map((r) => Sanctuaries[r.id]?.clue ?? 0)
    return this.points * (sum(regionClues) + sum(sanctuaryClues))
  }
}