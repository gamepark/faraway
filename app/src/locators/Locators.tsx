import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { ItemLocator } from '@gamepark/react-game'
import { playerRegionLineLocator } from './PlayerRegionLineLocator'
import { playerSanctuaryLineLocator } from './PlayerSanctuaryLineLocator'
import { regionDeckLocator } from './RegionDeckLocator'
import { regionHandLocator } from './RegionHandLocator'
import { regionLocator } from './RegionLocator'
import { sanctuaryHandLocator } from './SactuaryHandLocator'
import { sanctuaryDeckLocator } from './SanctuaryDeckLocator'

export const Locators: Partial<Record<LocationType, ItemLocator<PlayerId, MaterialType, LocationType>>> = {
  [LocationType.RegionDeck]: regionDeckLocator,
  [LocationType.SanctuaryDeck]: sanctuaryDeckLocator,
  [LocationType.RegionHand]: regionHandLocator,
  [LocationType.SanctuaryHand]: sanctuaryHandLocator,
  [LocationType.PlayerRegion]: playerRegionLineLocator,
  [LocationType.PlayerSanctuary]: playerSanctuaryLineLocator,
  [LocationType.Region]: regionLocator
}
