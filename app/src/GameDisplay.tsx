import { useDndMonitor } from '@dnd-kit/core'
import { css } from '@emotion/react'
import { DevToolsHub, ExtensionInfoDialog, GameTable, usePlay, usePlayerId } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC, useCallback } from 'react'
import { DevCardViewer } from './dev/DevCardViewer'
import { ExtensionsTableButton } from './extension/ExtensionsTableButton'
import { useExtensionPopups } from './extension/useExtensionPopups'
import { tableSize } from './panels/PanelConstants'
import { PlayerPanels } from './panels/PlayerPanels'

const SwitchViewOnDrag: FC = () => {
  const play = usePlay()
  const me = usePlayerId()
  const onDragStart = useCallback(() => {
    if (me) play(MaterialMoveBuilder.changeView(me), { transient: true })
  }, [me, play])
  useDndMonitor({ onDragStart })
  return null
}

export const GameDisplay: FC = () => {
  const { popups } = useExtensionPopups()
  return (
    <>
      <GameTable {...tableSize}
        verticalCenter
        zoom={false}
        margin={{ top: 7, left: 0, right: 0, bottom: 0 }} css={process.env.NODE_ENV === 'development' ? borderCss : undefined}>
        <PlayerPanels />
        <ExtensionsTableButton/>
        <SwitchViewOnDrag />
        {import.meta.env.DEV && <DevToolsHub><DevCardViewer /></DevToolsHub>}
      </GameTable>
      <ExtensionInfoDialog popups={popups}/>
    </>
  )
}

const borderCss = css`
  border: 0.1em solid white;
`
