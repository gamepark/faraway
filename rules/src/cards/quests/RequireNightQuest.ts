import { MaterialItem } from '@gamepark/rules-api'
import { sum } from 'es-toolkit/compat'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Region } from '../Region'
import { Regions } from '../Regions'
import { Sanctuaries } from '../Sanctuaries'
import { Sanctuary } from '../Sanctuary'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

/**
 * Threshold quest from the Starry Skies extension: score `points` only if the player has at
 * least `threshold` night markers across all visible regions and sanctuaries.
 */
export class RequireNightQuest extends Quest {
  type = QuestType.RequireNight

  constructor(readonly points: number, readonly threshold: number) {
    super(points)
  }

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    const total = sum(regions.map(r => Regions[r.id]?.night ?? 0))
      + sum(sanctuaries.map(s => Sanctuaries[s.id]?.night ?? 0))
    return total >= this.threshold ? this.points : undefined
  }
}
