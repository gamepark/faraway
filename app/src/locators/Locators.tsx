/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { ItemLocator } from '@gamepark/react-game'
import { playerRegionLineLocator } from './PlayerRegionLineLocator'
import { playerSanctuaryLineLocator } from './PlayerSanctuaryLineLocator'
import { regionDeckLocator } from './RegionDeckLocator'
import { regionDiscardLocator } from './RegionDiscardLocator'
import { regionHandLocator } from './RegionHandLocator'
import { regionLocator } from './RegionLocator'
import { sanctuaryHandLocator } from './SactuaryHandLocator'
import { sanctuaryDeckLocator } from './SanctuaryDeckLocator'
import { sanctuaryDiscardLocator } from './SanctuaryDiscardLocator'
import { regionScorePointLocator } from './RegionScorePointLocator'
import { sanctuaryScorePointLocator } from './SanctuaryScorePointLocator'

export const Locators: Partial<Record<LocationType, ItemLocator<PlayerId, MaterialType, LocationType>>> = {
  [LocationType.RegionDeck]: regionDeckLocator,
  [LocationType.SanctuaryDeck]: sanctuaryDeckLocator,
  [LocationType.PlayerRegionHand]: regionHandLocator,
  [LocationType.PlayerSanctuaryHand]: sanctuaryHandLocator,
  [LocationType.PlayerRegionLine]: playerRegionLineLocator,
  [LocationType.PlayerSanctuaryLine]: playerSanctuaryLineLocator,
  [LocationType.Region]: regionLocator,
  [LocationType.RegionDiscard]: regionDiscardLocator,
  [LocationType.SanctuaryDiscard]: sanctuaryDiscardLocator,
  [LocationType.RegionScorePoints]: regionScorePointLocator,
  [LocationType.SanctuaryScorePoints]: sanctuaryScorePointLocator
}
