import { MaterialItem } from '@gamepark/rules-api'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'

export class ThistleQuest extends Quest {

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const chimeras = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Thistle)
    return chimeras * this.points
  }
}