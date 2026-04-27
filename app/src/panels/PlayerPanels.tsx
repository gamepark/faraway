import { css } from '@emotion/react'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { usePlayerId, usePlayers, useRules } from '@gamepark/react-game'
import { FC } from 'react'
import { FarawayPlayerPanel } from './FarawayPlayerPanel'
import { getPanelScale, panelGapTable, panelMargin, panelTopMargin } from './PanelConstants'

export const PlayerPanels: FC = () => {
  const players = usePlayers({ sortFromMe: true })
  const rules = useRules<FarawayRules>()!
  const me = usePlayerId()
  const viewedPlayer = ((rules as unknown as { game: { view?: PlayerId } }).game.view ?? me ?? players[0]?.id) as PlayerId | undefined
  const n = rules.game.players.length
  const scale = getPanelScale(n)

  const anchorBottom = n >= 6

  return (
    <div
      css={[containerCss, anchorBottom && anchorBottomCss]}
      style={{
        fontSize: `${scale}em`,
        gap: `${panelGapTable / scale}em`,
        padding: `0 ${panelMargin / scale}em`,
        top: anchorBottom ? undefined : `${panelTopMargin / scale}em`,
        bottom: anchorBottom ? `${panelTopMargin / scale}em` : undefined
      }}
    >
      {players.map((player) => (
        <FarawayPlayerPanel
          key={player.id}
          player={player}
          isViewed={player.id === viewedPlayer}
        />
      ))}
    </div>
  )
}

const containerCss = css`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  transform: translateZ(5em);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`

const anchorBottomCss = css`
  justify-content: flex-end;
`
