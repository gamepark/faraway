import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { PlayerId } from '../../PlayerId'
import { Region } from '../Region'
import { countCriterion } from '../CardCounting'
import { Criterion } from '../Criterion'
import { Sanctuary } from '../Sanctuary'
import { Spirit } from '../Spirit'
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

  getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[], _playerId?: PlayerId, spirits: MaterialItem<PlayerId, LocationType, Spirit>[] = []): number | undefined {
    const total = countCriterion(Criterion.Night, { regions, sanctuaries, spirits })
    return total >= this.threshold ? this.points : undefined
  }
}
