import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isEndPlayerTurn, isMoveItemType, MaterialMove } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'

export const SacrificeSanctuaryHeader = () => {
  const { t } = useTranslation()
  const playerId = usePlayerId()
  const rules = useRules<FarawayRules>()
  const activePlayers = rules?.game.rule?.players ?? []
  const player = usePlayerName(activePlayers[0])
  const isActive = playerId !== undefined && activePlayers.includes(playerId)
  const endTurnMove = useLegalMove<MaterialMove>(move => isActive && isEndPlayerTurn(move) && move.player === playerId)
  // The rule lists `sanctuary → SanctuaryDeck` moves only while the player still has
  // cost left to pay; once paid in full those moves disappear and only endPlayerTurn
  // remains. So "no sanctuary moves" ⇔ commit boundary — the right moment to auto-fire.
  const hasPendingSacrificeMove = useLegalMove<MaterialMove>(move =>
    isActive && isMoveItemType(MaterialType.Sanctuary)(move) && move.location.type === LocationType.SanctuaryDeck
  ) !== undefined
  const autoSeconds = endTurnMove && !hasPendingSacrificeMove ? 5 : undefined

  if (!isActive) {
    if (activePlayers.length === 1) {
      return <>{t('header.sacrifice.player', { player })}</>
    }
    return <>{t('header.sacrifice.players')}</>
  }

  return (
    <>
      {t('header.sacrifice.you')}
      {endTurnMove && (
        <>
          {' '}
          <PlayMoveButton move={endTurnMove} auto={autoSeconds}>
            <Trans i18nKey="button.validate-sacrifice"/>
          </PlayMoveButton>
        </>
      )}
    </>
  )
}
