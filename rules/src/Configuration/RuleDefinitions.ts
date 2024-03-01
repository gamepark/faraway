import { MaterialRulesPartCreator } from "@gamepark/rules-api"
import { RuleId } from '../rules/RuleId'

export const rules: Record<RuleId, MaterialRulesPartCreator> = {
    [RuleId.ChooseHandCard]: ChooseHandCardRule,
    [RuleId.ChooseRegionCard]: ChooseRegionCardRule,
    [RuleId.ChoosesanctuaryCard]: ChooseSanctuaryCardRule,
    [RuleId.DiscardsanctuaryCard]: DiscardSanctuaryCardRule,
    [RuleId.EndOfTurn]: EndOfTurnRule,
    [RuleId.PrepareNewRound]: PrepareNewRoundRule,
    [RuleId.DefineFirstPlayer]: DefineFirstPlayerRule,

}