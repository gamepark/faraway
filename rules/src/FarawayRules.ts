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
import { Quest } from './cards/quests/Quest'
import { RegionQuests } from './cards/RegionQuests'
import { SanctuaryQuests } from './cards/SanctuaryQuests'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { ChooseNewRegionCardRule } from './rules/ChooseNewRegionCardRule'
import { DealSanctuariesRule } from './rules/DealSanctuariesRule'
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
      [LocationType.SanctuaryDiscard]: new PositiveSequenceStrategy()
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
    let score = 0
    const regionIndexes = this.material(MaterialType.Region).location(LocationType.PlayerRegionLine).player(playerId).getIndexes()
    for (let index of regionIndexes) {
      const item = this.material(MaterialType.Region).getItem(index)!
      const quest: Quest = RegionQuests[item.id]
      if (!quest) continue
      score += quest.getTotalScore(this.game, index, playerId)
    }

    const sanctuariesIndexes = this.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryLine).player(playerId).getIndexes()
    for (let index of sanctuariesIndexes) {
      const item = this.material(MaterialType.Sanctuary).getItem(index)!
      const quest: Quest = SanctuaryQuests[item.id]
      if (!quest) continue
      score += quest.getTotalScore(this.game, index, playerId)
    }

    return score
  }

  giveTime(_playerId: PlayerId): number {
    return 60
  }

}