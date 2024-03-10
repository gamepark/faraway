/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { usePlayerId, usePlayers, useRules } from '@gamepark/react-game'
import { FC } from 'react'
import { createPortal } from 'react-dom'
import { getBoardIndex } from '../locators/position/PositionOnTable'
import { FarawayPlayerPanel } from './FarawayPlayerPanel'

export const PlayerPanels: FC<any> = () => {
  const playerId = usePlayerId()
  const players = usePlayers({ sortFromMe: true })
  const rules = useRules<FarawayRules>()!

  const root = document.getElementById('root')
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player) =>
        <FarawayPlayerPanel key={player.id} player={player} css={panelPosition(players.length, getBoardIndex({ player: player.id }, rules, playerId))}/>
      )}
    </>,
    root
  )
}
const panelPosition = (players: number, index: number) => css`
  position: absolute;
  width: 28em;
  height: 8.3em;
  border: 0;
  ${getPanelPosition(players, index)};
`

const getPanelPosition = (players: number, index: number) => {
  switch (index) {
    case 0:
      if (players < 3) return css`bottom: 1em; right: 1em`
      return css`bottom: 1em; left: 1em`
    case 1:
      if (players < 3) return css`top: 8.5em; right: 1em`
      return css`top: 8.5em; left: 1em`
    case 2:
      if (players < 5) return css`top: 8.5em; right: 1em`
      return css`top: 8.5em; left: calc(50dvw - 14em)`
    case 3:
      return css`top: 8.5em; right: 1em`
    case 4:
      return css`bottom: 1em; right: 1em`
    case 5:
      if (players < 5) return css`bottom: 1em; right: 1em`
      return css`bottom: 1em; left: calc(50dvw - 14em)`
    default:
      return
  }
}