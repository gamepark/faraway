import { LocationType } from '../material/LocationType'
import { LocationStrategy, PositiveSequenceStrategy } from '@gamepark/rules-api'
import Heir from '../material/Heir'
import { MaterialType } from '../material/MaterialType'

export const locationsStrategies:  Partial<Record<MaterialType, Partial<Record<LocationType, LocationStrategy<Heir, MaterialType, LocationType>>>>> = {
    [MaterialType.RegionCard]: {
        [LocationType.Hand]: new PositiveSequenceStrategy(),
        [LocationType.ReionPlayer ]: new PositiveSequenceStrategy(),
        [LocationType.SanctuarPlayer]: new PositiveSequenceStrategy(),
        [LocationType.RegionDeck]: new PositiveSequenceStrategy(),
        [LocationType.SanctuaryDeck]: new PositiveSequenceStrategy(),
        [LocationType.PlayerHyena]: new PositiveSequenceStrategy()
    }
    [MaterialType.RegionCard]: {

}
