import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Region } from '../Region'
import { Sanctuary } from '../Sanctuary'
import { wonders } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class WonderSetQuest extends Quest {
  type = QuestType.WonderSet

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    return Math.min(...wonders.map(wonder => this.getPlayerWonderCount(regions, sanctuaries, wonder))) * this.points
  }
}
