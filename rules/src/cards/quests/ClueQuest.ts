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

export class ClueQuest extends Quest {
  type = QuestType.Clue

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    const regionClues = regions.map((r) => Regions[r.id]?.clue ?? 0)
    const sanctuaryClues = sanctuaries.map((r) => Sanctuaries[r.id]?.clue ?? 0)
    return this.points * (sum(regionClues) + sum(sanctuaryClues))
  }
}
