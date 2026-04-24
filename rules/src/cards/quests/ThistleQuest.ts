import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Region } from '../Region'
import { Sanctuary } from '../Sanctuary'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class ThistleQuest extends Quest {
  type = QuestType.Thistle

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    const chimeras = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Thistle)
    return chimeras * this.points
  }
}
