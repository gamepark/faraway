/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { ItemLocator } from '@gamepark/react-game'
import { cardCharacteristicLocator } from './CardCharacteristicLocator'
import { playerRegionLineLocator } from './PlayerRegionLineLocator'
import { playerSanctuaryLineLocator } from './PlayerSanctuaryLineLocator'
import { regionDeckLocator } from './RegionDeckLocator'
import { regionDiscardLocator } from './RegionDiscardLocator'
import { regionHandLocator } from './RegionHandLocator'
import { regionLocator } from './RegionLocator'
import { regionScorePointLocator } from './RegionScorePointLocator'
import { sanctuaryDeckLocator } from './SanctuaryDeckLocator'
import { sanctuaryHandLocator } from './SanctuaryHandLocator'
import { sanctuaryScorePointLocator } from './SanctuaryScorePointLocator'
import { scoreSheetBoxLocator } from './ScoreSheetBoxLocator'
import { scoreSheetLocator } from './ScoreSheetLocator'

export const Locators: Partial<Record<LocationType, ItemLocator<PlayerId, MaterialType, LocationType>>> = {
  [LocationType.RegionDeck]: regionDeckLocator,
  [LocationType.SanctuaryDeck]: sanctuaryDeckLocator,
  [LocationType.PlayerRegionHand]: regionHandLocator,
  [LocationType.PlayerSanctuaryHand]: sanctuaryHandLocator,
  [LocationType.PlayerRegionLine]: playerRegionLineLocator,
  [LocationType.PlayerSanctuaryLine]: playerSanctuaryLineLocator,
  [LocationType.Region]: regionLocator,
  [LocationType.RegionDiscard]: regionDiscardLocator,
  [LocationType.RegionScorePoints]: regionScorePointLocator,
  [LocationType.SanctuaryScorePoints]: sanctuaryScorePointLocator,
  [LocationType.CardCharacteristics]: cardCharacteristicLocator,
  [LocationType.ScoreSheet]: scoreSheetLocator,
  [LocationType.ScoreSheetBox]: scoreSheetBoxLocator
}
