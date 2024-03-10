/** @jsxImportSource @emotion/react */
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

export const ChooseHandCardsHeader = () => {
  const { t } = useTranslation()
  const playerId = usePlayerId()
  const activePlayers = useRules<FarawayRules>()?.game.rule?.players ?? []
  const player = usePlayerName(activePlayers[0])
  const rules = useRules<FarawayRules>()
  if (playerId !== undefined && activePlayers.includes(playerId)) {
    const cardsInHand = rules?.material(MaterialType.Region).location(LocationType.PlayerRegionHand).player(playerId).length ?? 0
    return <>{t('header.choose-hand.you', { count: cardsInHand - 3})}</>
  } else if (activePlayers.length === 1) {
    const cardsInHand = rules?.material(MaterialType.Region).location(LocationType.PlayerRegionHand).player(activePlayers[0]).length ?? 0
    return <>{t('header.choose-hand.player', { player, count: cardsInHand - 3 })}</>
  } else {
    return <>{t('header.choose-hand.players')}</>
  }
}
