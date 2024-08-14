/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useMaterialContext, usePlayers } from '@gamepark/react-game'
import { FC } from 'react'
import { createPortal } from 'react-dom'
import { getPlayerIndex } from '../locators/position/PositionOnTable'
import { FarawayPlayerPanel } from './FarawayPlayerPanel'

export const PlayerPanels: FC<any> = () => {
  const players = usePlayers({ sortFromMe: true })
  const context = useMaterialContext()

  const root = document.getElementById('root')
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player) =>
        <FarawayPlayerPanel key={player.id} player={player} css={panelPosition(players.length, getPlayerIndex(context, player.id))}/>
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
      if (players < 3) return css`bottom: 1em;
        right: 1em`
      return css`bottom: 1em;
        left: 1em`
    case 1:
      if (players < 3) return css`top: 8.5em;
        right: 1em`
      return css`top: 8.5em;
        left: 1em`
    case 2:
      if (players < 5) return css`top: 8.5em;
        right: 1em`
      return css`top: 8.5em;
        left: calc(50dvw - 14em)`
    case 3:
      return css`top: 8.5em;
        right: 1em`
    case 4:
      return css`bottom: 1em;
        right: 1em`
    case 5:
      if (players < 5) return css`bottom: 1em;
        right: 1em`
      return css`bottom: 1em;
        left: calc(50dvw - 14em)`
    default:
      return
  }
}