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

export class ClueQuest extends Quest {
  type = QuestType.Clue

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[], _playerId?: PlayerId, spirits: MaterialItem<PlayerId, LocationType, Spirit>[] = []): number | undefined {
    return this.points * countCriterion(Criterion.Clue, { regions, sanctuaries, spirits })
  }
}
