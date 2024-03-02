/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { PlayerPanel, usePlayerId, usePlayers, useRules } from '@gamepark/react-game'
import { FC } from 'react'

export const PlayerPanels: FC<any> = () => {
  const playerId = usePlayerId()
  const players = usePlayers({ sortFromMe: true })
  const rules = useRules<FarawayRules>()!
  return (
    <>
      {players.map((player, index) =>
        <PlayerPanel key={player.id} playerId={player.id} css={[panelPosition(index), player.id === (playerId ?? rules.players[0])? bottomPosition: topPosition ]}/>
      )}
    </>
  )
}
const panelPosition = (index: number) => css`
  position: absolute;
  right: 1em;
  top: ${8.5 + index * 16}em;
  width: 28em;
  height: 8.3em;
`

const topPosition = css`
  top: 8.5em;
`

const bottomPosition = css`
  top: 90em;
`