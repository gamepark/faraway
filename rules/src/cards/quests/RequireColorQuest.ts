import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Color } from '../Color'
import { getColor, Region } from '../Region'
import { Sanctuary } from '../Sanctuary'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

/**
 * Threshold quest from the Starry Skies extension: score `points` only if the player has at
 * least `threshold` cards of the given color (regions + sanctuaries combined, all visible).
 */
export class RequireColorQuest extends Quest {
  type = QuestType.RequireColor

  constructor(readonly points: number, readonly color: Color, readonly threshold: number) {
    super(points)
  }

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    const count = regions.filter(r => getColor(r.id) === this.color).length
      + sanctuaries.filter(s => getColor(s.id) === this.color).length
    return count >= this.threshold ? this.points : undefined
  }
}
