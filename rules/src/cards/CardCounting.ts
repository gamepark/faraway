import { MaterialItem } from '@gamepark/rules-api'
import { sum } from 'es-toolkit/compat'
import { LocationType } from '../material/LocationType'
import { PlayerId } from '../PlayerId'
import { Color } from './Color'
import { Criterion } from './Criterion'
import { getColor, getValue, Region } from './Region'
import { Regions } from './Regions'
import { Sanctuaries } from './Sanctuaries'
import { Sanctuary } from './Sanctuary'
import { Spirit } from './Spirit'
import { Spirits } from './Spirits'
import { Wonder } from './Wonder'

export type Cards = {
  regions: MaterialItem<PlayerId, LocationType, Region>[]
  sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]
  /** Spirits attached to the regions. Their location.x is the x of the region they are attached to. */
  spirits?: MaterialItem<PlayerId, LocationType, Spirit>[]
}

const criterionColor: Partial<Record<Criterion, Color>> = {
  [Criterion.RedCard]: Color.Red,
  [Criterion.GreenCard]: Color.Green,
  [Criterion.BlueCard]: Color.Blue,
  [Criterion.YellowCard]: Color.Yellow,
  [Criterion.GrayCard]: Color.Gray
}

const criterionWonder: Partial<Record<Criterion, Wonder>> = {
  [Criterion.Chimera]: Wonder.Chimera,
  [Criterion.Rock]: Wonder.Rock,
  [Criterion.Thistle]: Wonder.Thistle
}

export const getCriterionColor = (criterion: Criterion): Color | undefined => criterionColor[criterion]
export const getCriterionWonder = (criterion: Criterion): Wonder | undefined => criterionWonder[criterion]

/**
 * Spirit cards are not connected to any biome: they never count as a card of a color.
 * Their resources and icons count, once they are visible.
 */
export const countCriterion = (criterion: Criterion, { regions, sanctuaries, spirits = [] }: Cards): number => {
  const color = criterionColor[criterion]
  if (color !== undefined) {
    return regions.filter(r => getColor(r.id) === color).length + sanctuaries.filter(s => getColor(s.id) === color).length
  }
  const wonder = criterionWonder[criterion]
  if (wonder !== undefined) {
    return countWonders(wonder, { regions, sanctuaries, spirits })
  }
  switch (criterion) {
    case Criterion.Clue:
      return sum(regions.map(r => Regions[r.id]?.clue ?? 0))
        + sum(sanctuaries.map(s => Sanctuaries[s.id]?.clue ?? 0))
        + sum(spirits.map(s => Spirits[s.id].clue ?? 0))
    case Criterion.Night:
      return sum(regions.map(r => Regions[r.id]?.night ?? 0))
        + sum(sanctuaries.map(s => Sanctuaries[s.id]?.night ?? 0))
        + sum(spirits.map(s => Spirits[s.id].night ?? 0))
    case Criterion.NoResourceCard:
      // A Spirit placed under a Region card is considered as one card with it.
      return regions.filter(r => !Regions[r.id]?.wonders?.length
          && !spirits.some(s => s.location.x === r.location.x && Spirits[s.id].wonders?.length)).length
        + sanctuaries.filter(s => !Sanctuaries[s.id]?.wonders?.length).length
    case Criterion.ShortExploration:
      return regions.filter(r => getValue(r.id) < 20).length
    case Criterion.LongExploration:
      return regions.filter(r => getValue(r.id) > 40).length
    case Criterion.Spirit:
      return spirits.length
    default:
      return 0
  }
}

export const countWonders = (wonder: Wonder, { regions, sanctuaries, spirits = [] }: Cards): number => sum([
  ...regions.map(r => (Regions[r.id]?.wonders ?? []).filter(w => w === wonder).length),
  ...sanctuaries.map(s => (Sanctuaries[s.id]?.wonders ?? []).filter(w => w === wonder).length),
  ...spirits.map(s => (Spirits[s.id].wonders ?? []).filter(w => w === wonder).length)
])
