import { Region } from '@gamepark/faraway/cards/Region'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { ItemLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { RegionScorePointDescription } from './description/RegionScorePointDescription'

export class RegionScorePointLocator extends ItemLocator {
  locationDescription = new RegionScorePointDescription()
  parentItemType = MaterialType.Region

  getPositionOnParent(location: Location, context: MaterialContext) {
    const region = context.rules.material(MaterialType.Region).getItem(location.parent!)?.id
    return { x: RegionScoreX[region] ?? 60, y: RegionScoreY[region] ?? 35 }
  }
}

const RegionScoreX: Partial<Record<Region, number>> = {
  [Region.Blue40]: 53,
  [Region.Blue46]: 55,
  [Region.Red52]: 53,
  [Region.Blue55]: 53,
}

const RegionScoreY: Partial<Record<Region, number>> = {
  [Region.Green5]: 43,
  [Region.Green15]: 27,
  [Region.Red16]: 42,
  [Region.Blue17]: 32,
  [Region.Green18]: 50,
  [Region.Red19]: 42,
  [Region.Blue21]: 38,
  [Region.Green22]: 40,
  [Region.Red23]: 50,
  [Region.Yellow27]: 45,
  [Region.Yellow29]: 40,
  [Region.Red30]: 40,
  [Region.Yellow31]: 45,
  [Region.Red32]: 32,
  [Region.Yellow33]: 48,
  [Region.Yellow35]: 48,
  [Region.Green38]: 45,
  [Region.Red39]: 42,
  [Region.Blue40]: 52,
  [Region.Yellow42]: 48,
  [Region.Blue43]: 45,
  [Region.Yellow44]: 48,
  [Region.Green45]: 27,
  [Region.Blue46]: 52,
  [Region.Yellow47]: 45,
  [Region.Red48]: 45,
  [Region.Blue49]: 45,
  [Region.Yellow50]: 50,
  [Region.Red52]: 50,
  [Region.Yellow53]: 38,
  [Region.Green54]: 40,
  [Region.Blue55]: 52,
  [Region.Red57]: 38,
  [Region.Yellow62]: 40,
  [Region.Yellow65]: 40,
}

export const regionScorePointLocator = new RegionScorePointLocator()