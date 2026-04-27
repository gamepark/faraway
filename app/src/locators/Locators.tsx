import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { DeckLocator, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { getRegionDeckPosition, getSanctuaryDeckPosition } from '../panels/PanelConstants'
import { cardCharacteristicLocator } from './CardCharacteristicLocator'
import { playerRegionLocator } from './PlayerRegionLocator'
import { playerSanctuaryLocator } from './PlayerSanctuaryLocator'
import { regionDiscardLocator } from './RegionDiscardLocator'
import { regionHandLocator } from './RegionHandLocator'
import { regionLocator } from './RegionLocator'
import { regionScorePointLocator } from './RegionScorePointLocator'
import { sanctuaryHandLocator } from './SanctuaryHandLocator'
import { sanctuaryScorePointLocator } from './SanctuaryScorePointLocator'
import { scoreSheetBoxLocator } from './ScoreSheetBoxLocator'
import { scoreSheetLocator } from './ScoreSheetLocator'

class RegionDeckLocator extends DeckLocator {
  limit = 20

  getCoordinates(_location: Location, context: MaterialContext) {
    return getRegionDeckPosition(context.rules.players.length)
  }
}

class SanctuaryDeckLocator extends DeckLocator {
  limit = 20

  getCoordinates(_location: Location, context: MaterialContext) {
    return getSanctuaryDeckPosition(context.rules.players.length)
  }
}

export const Locators: Partial<Record<LocationType, Locator<PlayerId, MaterialType, LocationType>>> = {
  [LocationType.RegionDeck]: new RegionDeckLocator(),
  [LocationType.SanctuaryDeck]: new SanctuaryDeckLocator(),
  [LocationType.PlayerRegionHand]: regionHandLocator,
  [LocationType.PlayerSanctuaryHand]: sanctuaryHandLocator,
  [LocationType.PlayerRegionLine]: playerRegionLocator,
  [LocationType.PlayerSanctuaryLine]: playerSanctuaryLocator,
  [LocationType.Region]: regionLocator,
  [LocationType.RegionDiscard]: regionDiscardLocator,
  [LocationType.RegionScorePoints]: regionScorePointLocator,
  [LocationType.SanctuaryScorePoints]: sanctuaryScorePointLocator,
  [LocationType.CardCharacteristics]: cardCharacteristicLocator,
  [LocationType.ScoreSheet]: scoreSheetLocator,
  [LocationType.ScoreSheetBox]: scoreSheetBoxLocator
}
