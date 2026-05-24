/** @jsxImportSource @emotion/react */
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { Memory } from '@gamepark/faraway/rules/Memory'
import { MaterialLogProps } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

/** "Round X / 8" separator inserted at the start of every PlaceRegion
 *  phase. Two render paths:
 *
 *   - `RoundSeparatorLog` (move-driven): used by the dispatcher for
 *     rounds 2-8, fired on the startSimultaneousRule(PlaceRegion) move.
 *     Memory.Round is incremented inside RefillRegionRule.onRuleEnd
 *     which fires when that startSimultaneousRule is played — and
 *     context.game is the snapshot BEFORE the move applies, so we
 *     replay the move on a clone to read the post-move Round.
 *
 *   - `RoundSeparatorSetupLog` (setup-driven): used by
 *     getSetupLogDescriptions to display "Round 1 / 8" at the very
 *     top of the journal — even before the optional ChooseHandCards
 *     put-backs in a non-beginner game. Reads Memory.Round directly
 *     from the setup state where it's already initialized to 1. */
export const RoundSeparatorLog: FC<MaterialLogProps> = ({ move, context }) => {
  const rules = new FarawayRules(structuredClone(context.game))
  rules.play(move)
  const round = rules.remind<number>(Memory.Round)
  return <Trans i18nKey="log.round" values={{ round, total: 8 }}/>
}

export const RoundSeparatorSetupLog: FC<{ game: MaterialGame }> = ({ game }) => {
  const round = new FarawayRules(game).remind<number>(Memory.Round) ?? 1
  return <Trans i18nKey="log.round" values={{ round, total: 8 }}/>
}
