import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Color } from '../Color'
import { getColor, Region } from '../Region'
import { Sanctuary } from '../Sanctuary'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

export class AllColorQuest extends Quest {
  type = QuestType.AllColor

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    const red = this.getItemsOfColor(regions, Color.Red) + this.getItemsOfColor(sanctuaries, Color.Red)
    const green = this.getItemsOfColor(regions, Color.Green) + this.getItemsOfColor(sanctuaries, Color.Green)
    const blue = this.getItemsOfColor(regions, Color.Blue) + this.getItemsOfColor(sanctuaries, Color.Blue)
    const yellow = this.getItemsOfColor(regions, Color.Yellow) + this.getItemsOfColor(sanctuaries, Color.Yellow)
    return Math.min(red, green, blue, yellow) * this.points
  }

  getItemsOfColor(items: MaterialItem<PlayerId, LocationType, Region | Sanctuary>[], color: Color) {
    return items.filter((i) => getColor(i.id) === color).length
  }
}
