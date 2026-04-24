import { MaterialItem } from '@gamepark/rules-api'
import { sum } from 'es-toolkit/compat'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Region } from '../Region'
import { Regions } from '../Regions'
import { Sanctuaries } from '../Sanctuaries'
import { Sanctuary } from '../Sanctuary'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class NightQuest extends Quest {
  type = QuestType.Night

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    const nightRegions = regions.map((r) => Regions[r.id]?.night ?? 0)
    const nightSanctuaries = sanctuaries.map((r) => Sanctuaries[r.id]?.night ?? 0)
    return this.points * (sum(nightRegions) + sum(nightSanctuaries))
  }
}
