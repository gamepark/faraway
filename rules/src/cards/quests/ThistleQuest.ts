import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Region } from '../Region'
import { Sanctuary } from '../Sanctuary'
import { Spirit } from '../Spirit'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class ThistleQuest extends Quest {
  type = QuestType.Thistle

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[], _playerId?: PlayerId, spirits: MaterialItem<PlayerId, LocationType, Spirit>[] = []): number | undefined {
    const chimeras = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Thistle, spirits)
    return chimeras * this.points
  }
}
