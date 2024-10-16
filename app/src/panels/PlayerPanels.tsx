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

const bottomRight = css`
  bottom: 1em;
  right: 1em;
`

const bottomLeft = css`
  bottom: 1em;
  left: 1em;
`

const topRight = css`
  top: 8.5em;
  right: 1em;
`

const topLeft = css`
  top: 8.5em;
  left: 1em;
`

const topCenter = css`
  top: 8.5em;
  left: calc(50dvw - 14em);
`

const bottomCenter = css`
  bottom: 1em;
  left: calc(50dvw - 14em);
`

const topCenterLeft = css`
  top: 8.5em;
  left: calc(40dvw - 14em);
`

const topCenterRight = css`
  top: 8.5em;
  left: calc(67dvw - 14em);
`

const bottomCenterLeft = css`
  bottom: 1em;
  left: calc(40dvw - 14em);
`

const bottomCenterRight = css`
  bottom: 1em;
  left: calc(67dvw - 14em);
`

const getPanelPosition = (players: number, index: number) => {
  switch (index) {
    case 0:
      return players < 3 ? bottomRight : bottomLeft
    case 1:
      return players < 3 ? topRight : topLeft
    case 2:
      return players < 5 ? topRight : players < 7 ? topCenter : topCenterLeft
    case 3:
      return players < 7 ? topRight : topCenterRight
    case 4:
      return topRight
    case 5:
      return bottomRight
    case 6:
      return players < 7 ? bottomRight : bottomCenterRight
    case 7:
    default:
      return players < 5 ? bottomRight : players < 7 ? bottomCenter : bottomCenterLeft
  }
}