import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Color } from '../Color'
import { getColor, Region } from '../Region'
import { Sanctuary } from '../Sanctuary'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class ColorQuest extends Quest {
  type = QuestType.Color

  constructor(readonly points: number, readonly colors: Color[], readonly wonders: Wonder[] = []) {
    super(points, wonders)
  }

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    const regionsWithColor = regions.filter((r) => this.colors.includes(getColor(r.id))).length
    const sanctuariesWithColor = sanctuaries.filter((s) => this.colors.includes(getColor(s.id))).length
    return (regionsWithColor + sanctuariesWithColor) * this.points
  }
}
