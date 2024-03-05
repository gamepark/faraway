/** @jsxImportSource @emotion/react */
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

export const ExplorationHeader = () => {
  const { t } = useTranslation()
  const playerId = usePlayerId()
  const activePlayers = useRules<FarawayRules>()?.game.rule?.players ?? []
  const player = usePlayerName(activePlayers[0])
  if (playerId !== undefined && activePlayers.includes(playerId)) {
    return <>{t('header.explore.you')}</>
  } else if (activePlayers.length === 1) {
    return <>{t('header.explore.player', { player })}</>
  } else {
    return <>{t('header.explore.players')}</>
  }
}
