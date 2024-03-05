import { MaterialItem } from '@gamepark/rules-api'
import sum from 'lodash/sum'
import { Regions } from '../Regions'
import { Sanctuaries } from '../Sanctuaries'
import { Quest } from './Quest'

export class ClueQuest extends Quest {

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const regionClues = regions.map((r) => Regions[r.id]?.clue ?? 0)
    const sanctuaryClues = sanctuaries.map((r) => Sanctuaries[r.id]?.clue ?? 0)
    console.log(regionClues, sanctuaryClues, this.points * (sum(regionClues) + sum(sanctuaryClues)))
    return this.points * (sum(regionClues) + sum(sanctuaryClues))
  }
}