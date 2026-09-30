import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { CustomMoveType } from '@gamepark/faraway/rules/CustomMoveType'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'

export const ChooseSpiritHeader = () => {
  const { t } = useTranslation()
  const playerId = usePlayerId()
  const activePlayer = useRules<FarawayRules>()?.game.rule?.player
  const player = usePlayerName(activePlayer)
  const pass = useLegalMove<MaterialMove>(isCustomMoveType(CustomMoveType.Pass))
  if (playerId !== activePlayer) {
    return <>{t('header.spirit.player', { player })}</>
  }
  return <>
    {t('header.spirit.you')}
    {pass && <>
      {' '}
      <PlayMoveButton move={pass}><Trans i18nKey="button.spirit.pass"/></PlayMoveButton>
    </>}
  </>
}
