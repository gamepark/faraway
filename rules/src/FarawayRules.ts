import {
  CompetitiveScore,
  FillGapStrategy,
  hideItemId,
  hideItemIdToOthers,
  HidingStrategy,
  MaterialGame,
  MaterialItem,
  MaterialMove,
  PositiveSequenceStrategy,
  SecretMaterialRules,
  TimeLimit
} from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { ChooseNewRegionCardRule } from './rules/ChooseNewRegionCardRule'
import { DealSanctuariesRule } from './rules/DealSanctuariesRule'
import { ScoreHelper } from './rules/helper/ScoreHelper'
import { HideRegionLineRule } from './rules/HideRegionLineRule'
import { PlaceRegionRule } from './rules/PlaceRegionRule'
import { PlaceSanctuaryRule } from './rules/PlaceSanctuaryRule'
import { RefillRegionRule } from './rules/RefillRegionRule'
import { RevealRegionCards } from './rules/RevealRegionCards'
import { RuleId } from './rules/RuleId'
import { ScoringRule } from './rules/ScoringRule'


export const hideCardWhenNotRotated: HidingStrategy = (
  item: MaterialItem, player?: PlayerId
) => {
  if (item.location.rotation) return []
  return item.location.player === player ? [] : ['id']
}

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class FarawayRules extends SecretMaterialRules<PlayerId, MaterialType, LocationType>
  implements CompetitiveScore<MaterialGame<PlayerId, MaterialType, LocationType>, MaterialMove<PlayerId, MaterialType, LocationType>, PlayerId>,
    TimeLimit<MaterialGame<PlayerId, MaterialType, LocationType>, MaterialMove<PlayerId, MaterialType, LocationType>, PlayerId> {
  rules = {
    [RuleId.PlaceRegion]: PlaceRegionRule,
    [RuleId.RevealRegions]: RevealRegionCards,
    [RuleId.DealSanctuaries]: DealSanctuariesRule,
    [RuleId.ChooseNewRegion]: ChooseNewRegionCardRule,
    [RuleId.RefillRegion]: RefillRegionRule,
    [RuleId.PlaceSanctuary]: PlaceSanctuaryRule,
    [RuleId.HideRegionLine]: HideRegionLineRule,
    [RuleId.Scoring]: ScoringRule

  }

  locationsStrategies = {
    [MaterialType.Region]: {
      [LocationType.PlayerRegionHand]: new PositiveSequenceStrategy(),
      [LocationType.RegionDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerRegionLine]: new PositiveSequenceStrategy(),
      [LocationType.Region]: new FillGapStrategy(),
      [LocationType.RegionDiscard]: new PositiveSequenceStrategy()
    },
    [MaterialType.Sanctuary]: {
      [LocationType.PlayerSanctuaryHand]: new PositiveSequenceStrategy(),
      [LocationType.SanctuaryDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerSanctuaryLine]: new PositiveSequenceStrategy(),
    }
  }

  hidingStrategies = {
    [MaterialType.Region]: {
      [LocationType.PlayerRegionHand]: hideItemIdToOthers,
      [LocationType.RegionDeck]: hideItemId,
      [LocationType.PlayerRegionLine]: hideCardWhenNotRotated
    },
    [MaterialType.Sanctuary]: {
      [LocationType.PlayerSanctuaryHand]: hideItemIdToOthers,
      [LocationType.SanctuaryDeck]: hideItemId
    }
  }

  getScore(playerId: PlayerId) {
    return new ScoreHelper(this.game, playerId).score
  }

  giveTime(_playerId: PlayerId): number {
    return 60
  }

}