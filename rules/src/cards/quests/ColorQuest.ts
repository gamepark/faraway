import { MaterialItem } from '@gamepark/rules-api'
import { Color } from '../Color'
import { getColor } from '../Region'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class ColorQuest extends Quest {
  type = QuestType.Color

  constructor(readonly points: number, readonly colors: Color[], readonly wonders: Wonder[] = []) {
    super(points, wonders)
  }

  getScore(regions: MaterialItem[], sanctuaries: MaterialItem[]): number | undefined {
    const regionsWithColor = regions.filter((r) => this.colors.includes(getColor(r.id))).length
    const sanctuariesWithColor = sanctuaries.filter((s) => this.colors.includes(getColor(s.id))).length
    return (regionsWithColor + sanctuariesWithColor) * this.points
  }
}