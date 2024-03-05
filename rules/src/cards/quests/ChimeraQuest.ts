import { MaterialItem } from '@gamepark/rules-api'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'

export class ChimeraQuest extends Quest {

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const chimeras = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Chimera)
    return chimeras * this.points
  }
}