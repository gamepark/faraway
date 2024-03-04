/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { GameTable, GameTableNavigation, usePlayers } from '@gamepark/react-game'
import { FC } from 'react'
import { getTableSize } from './locators/position/PositionOnTable'
import { PlayerPanels } from './panels/PlayerPanels'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = () => {
  const players = usePlayers()
  if (!players.length) return null;
  const tableSize = getTableSize(players.length)
  return <>
    <GameTable { ...tableSize }
               verticalCenter
               margin={{ top: 7, left: 0, right: 0, bottom: 0 }} css={css`//background-color: rgba(255, 255, 255, 0.31)`}>
      <GameTableNavigation/>
      <PlayerPanels/>
    </GameTable>
  </>
}

