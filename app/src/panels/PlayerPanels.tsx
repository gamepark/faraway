import { css } from '@emotion/react'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { usePlayerId, usePlayers, useRules } from '@gamepark/react-game'
import { FC } from 'react'
import { OverviewMode } from '../overview/OverviewMode'
import { FarawayPlayerPanel } from './FarawayPlayerPanel'
import { getPanelHeight, getPanelScale, getPanelWidth, panelBottomMargin, panelGapTable, panelMargin } from './PanelConstants'

export const PlayerPanels: FC = () => {
  const players = usePlayers({ sortFromMe: true })
  const rules = useRules<FarawayRules>()!
  const me = usePlayerId()
  const viewedPlayer = ((rules as unknown as { game: { view?: PlayerId } }).game.view ?? me ?? players[0]?.id) as PlayerId | undefined
  const n = rules.game.players.length
  const scale = getPanelScale(n)

  // OverviewMode's toggle sits ABOVE the panel column. At 7 players the panel
  // stack reaches the top and crowds out the right edge, so we shift the button
  // LEFT to the panel's left edge; below 7 players we keep it right-aligned with
  // the panels. Using GameTable em (no panel scaling) so it stays a comfortable
  // hit target whatever the player count.
  const panelStackHeight = n * getPanelHeight(n) + (n - 1) * panelGapTable
  const buttonBottom = panelBottomMargin + panelStackHeight + 0.5
  const buttonRight = n >= 7
    ? panelMargin + getPanelWidth(n) - 2 // 2em = button width
    : panelMargin

  return (
    <>
      <div css={[containerCss, sizingCss(scale)]}>
        {players.map((player) => (
          <FarawayPlayerPanel
            key={player.id}
            player={player}
            isViewed={player.id === viewedPlayer}
          />
        ))}
      </div>
      <OverviewMode
        style={{ right: `${buttonRight}em`, bottom: `${buttonBottom}em` }}
      />
    </>
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
  justify-content: flex-end;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`

const sizingCss = (scale: number) => css`
  font-size: ${scale}em;
  gap: ${panelGapTable / scale}em;
  padding: 0 ${panelMargin / scale}em;
  bottom: ${panelBottomMargin / scale}em;
`
