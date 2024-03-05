/** @jsxImportSource @emotion/react */
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

export const NewRegionHeader = () => {
  const { t } = useTranslation()
  const playerId = usePlayerId()
  const activePlayer = useRules<FarawayRules>()?.game.rule?.player
  const player = usePlayerName(activePlayer)
  if (playerId === activePlayer) {
    return <>{t('header.new-region.you')}</>
  } else {
    return <>{t('header.new-region.player', { player })}</>
  }
}
