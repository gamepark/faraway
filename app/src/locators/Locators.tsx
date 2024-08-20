/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { DeckLocator, ListLocator, Locator } from '@gamepark/react-game'
import { regionCardDescription } from '../material/RegionCardDescription'
import { cardCharacteristicLocator } from './CardCharacteristicLocator'
import { playerRegionLocator } from './PlayerRegionLocator'
import { playerSanctuaryLocator } from './PlayerSanctuaryLocator'
import { regionDiscardLocator } from './RegionDiscardLocator'
import { regionHandLocator } from './RegionHandLocator'
import { regionScorePointLocator } from './RegionScorePointLocator'
import { sanctuaryHandLocator } from './SanctuaryHandLocator'
import { sanctuaryScorePointLocator } from './SanctuaryScorePointLocator'
import { scoreSheetBoxLocator } from './ScoreSheetBoxLocator'
import { scoreSheetLocator } from './ScoreSheetLocator'

export const Locators: Partial<Record<LocationType, Locator<PlayerId, MaterialType, LocationType>>> = {
  [LocationType.RegionDeck]: new DeckLocator({ coordinates: { x: -10, y: 4 } }),
  [LocationType.SanctuaryDeck]: new DeckLocator({ coordinates: { x: -17.5, y: 4 } }),
  [LocationType.PlayerRegionHand]: regionHandLocator,
  [LocationType.PlayerSanctuaryHand]: sanctuaryHandLocator,
  [LocationType.PlayerRegionLine]: playerRegionLocator,
  [LocationType.PlayerSanctuaryLine]: playerSanctuaryLocator,
  [LocationType.Region]: new ListLocator({ coordinates: { x: -2.5, y: 4 }, gap: { x: regionCardDescription.width + 0.5 } }),
  [LocationType.RegionDiscard]: regionDiscardLocator,
  [LocationType.RegionScorePoints]: regionScorePointLocator,
  [LocationType.SanctuaryScorePoints]: sanctuaryScorePointLocator,
  [LocationType.CardCharacteristics]: cardCharacteristicLocator,
  [LocationType.ScoreSheet]: scoreSheetLocator,
  [LocationType.ScoreSheetBox]: scoreSheetBoxLocator
}
