import {
  CompetitiveScore,
  hideItemId,
  hideItemIdToOthers,
  MaterialGame,
  MaterialMove,
  PositiveSequenceStrategy,
  SecretMaterialRules,
  TimeLimit
} from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { ChooseRegionCardRule } from './rules/ChooseRegionCardRule'
import { RuleId } from './rules/RuleId'


/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class FarawayRules extends SecretMaterialRules<PlayerId, MaterialType, LocationType>
  implements CompetitiveScore<MaterialGame<PlayerId, MaterialType, LocationType>, MaterialMove<PlayerId, MaterialType, LocationType>, PlayerId>,
    TimeLimit<MaterialGame<PlayerId, MaterialType, LocationType>, MaterialMove<PlayerId, MaterialType, LocationType>, PlayerId> {
  rules = {
    [RuleId.ChooseRegionCard]: ChooseRegionCardRule
    //[RuleId.ChooseRegionCard]: ChooseRegionCardRule,
    //[RuleId.ChoosesanctuaryCard]: ChooseSanctuaryCardRule,
    //[RuleId.DiscardsanctuaryCard]: DiscardSanctuaryCardRule,
    //[RuleId.EndOfTurn]: EndOfTurnRule,
    //[RuleId.PrepareNewRound]: PrepareNewRoundRule,
    //[RuleId.DefineFirstPlayer]: DefineFirstPlayerRule,

  }

  locationsStrategies = {
    [MaterialType.RegionCard]: {
      [LocationType.RegionHand]: new PositiveSequenceStrategy(),
      [LocationType.RegionLineLocator]: new PositiveSequenceStrategy(),
      [LocationType.PlayerSanctuary]: new PositiveSequenceStrategy(),
      [LocationType.RegionDeck]: new PositiveSequenceStrategy(),
      [LocationType.SanctuaryDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerRegion]: new PositiveSequenceStrategy(),
      [LocationType.Region]: new PositiveSequenceStrategy()
    },
    [MaterialType.SanctuaryCard]: {
      [LocationType.SanctuaryDeck]: new PositiveSequenceStrategy(),
        [LocationType.PlayerSanctuary]: new PositiveSequenceStrategy(),
    }
  }

  hidingStrategies = {
    [MaterialType.RegionCard]: {
      [LocationType.RegionHand]: hideItemIdToOthers,
      [LocationType.RegionDeck]: hideItemId,
      [LocationType.SanctuaryDeck]: hideItemId
    },
    [MaterialType.SanctuaryCard]: {
      [LocationType.RegionHand]: hideItemIdToOthers,
      [LocationType.SanctuaryDeck]: hideItemId,
    }
  }

  getScore(_playerId: PlayerId) {
    return 0
  }

  giveTime(_playerId: PlayerId): number {
    return 60
  }

}