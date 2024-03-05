import { MaterialItem } from '@gamepark/rules-api'
import sum from 'lodash/sum'
import { Regions } from '../Regions'
import { Sanctuaries } from '../Sanctuaries'
import { Quest } from './Quest'

export class NightQuest extends Quest {

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const nightRegions = regions.map((r) => Regions[r.id]?.night ?? 0)
    const nightSanctuaries = sanctuaries.map((r) => Sanctuaries[r.id]?.night ?? 0)
    console.log(sum(nightRegions) + sum(nightSanctuaries))
    return this.points * (sum(nightRegions) + sum(nightSanctuaries))
  }
}