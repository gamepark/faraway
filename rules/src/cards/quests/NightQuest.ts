import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Region } from '../Region'
import { countCriterion } from '../CardCounting'
import { Criterion } from '../Criterion'
import { Sanctuary } from '../Sanctuary'
import { Spirit } from '../Spirit'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class NightQuest extends Quest {
  type = QuestType.Night

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[], _playerId?: PlayerId, spirits: MaterialItem<PlayerId, LocationType, Spirit>[] = []): number | undefined {
    return this.points * countCriterion(Criterion.Night, { regions, sanctuaries, spirits })
  }
}
