import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { Memory } from '@gamepark/faraway/rules/Memory'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { scoreSheetX, scoreSheetY } from '../panels/PanelConstants'

export class ScoreSheetLocator extends Locator {
  getLocationCoordinates() {
    return { x: scoreSheetX, y: scoreSheetY }
  }

  // Force the score sheet's getLocations to re-run as scoring progresses, so its rows
  // fill in incrementally. ScoreSheetDescription.getLocations gates each row on
  // `region.location.rotation === true` and on whether any region is still hidden, so
  // we depend on the same three signals as PlayerRegionLocator / PlayerSanctuaryLocator.
  getPositionDependencies(_location: unknown, context: MaterialContext) {
    return {
      currentScoringX: context.rules.remind(Memory.CurrentScoringX) ?? null,
      isOver: context.rules.isOver(),
      hiddenRegions: context.rules.material(MaterialType.Region)
        .location(LocationType.PlayerRegionLine)
        .rotation(r => !r)
        .length
    }
  }
}

export const scoreSheetLocator = new ScoreSheetLocator()
