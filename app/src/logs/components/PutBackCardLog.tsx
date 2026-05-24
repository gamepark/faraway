/** @jsxImportSource @emotion/react */
import { MaterialLogProps, usePlayerName } from '@gamepark/react-game'
import { FC } from 'react'
import { Trans } from 'react-i18next'

type Props = MaterialLogProps

/** Setup-phase log: "<player> put a card back into the region deck".
 *
 *  No mini-card is rendered here on purpose — during ChooseHandCards
 *  every region in a player's starting hand is private to that player
 *  (hideItemIdToOthers), so the card identity is meant to stay hidden
 *  from spectators and other players. Even if we could read it, showing
 *  it would leak information about the player's discard choice.
 */
export const PutBackCardLog: FC<Props> = ({ move, context }) => {
  const player = (move as any).location?.player ?? context.action.playerId
  const name = usePlayerName(player) || ''
  return <Trans i18nKey="log.region.put-back" values={{ player: name }}/>
}
