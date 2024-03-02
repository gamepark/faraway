/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { GameTable, GameTableNavigation } from '@gamepark/react-game'
import { FC } from 'react'
import { PlayerPanels } from './panels/PlayerPanels'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = () => {
  return <>
    <GameTable xMin={-32} xMax={32} yMin={-28} yMax={35}
               margin={{ top: 7, left: 0, right: 0, bottom: 0 }} css={css`//background-color: rgba(255, 255, 255, 0.31)`}>
      <GameTableNavigation/>
    </GameTable>
    <PlayerPanels/>
  </>
}
