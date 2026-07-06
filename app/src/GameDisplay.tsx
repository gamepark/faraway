import { useDndMonitor } from '@dnd-kit/core'
import { css } from '@emotion/react'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { DevToolsHub, ExtensionInfoDialog, GameTable, usePlay, usePlayerId, useRules } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC, useCallback, useMemo } from 'react'
import { DevCardViewer } from './dev/DevCardViewer'
import { ExtensionsTableButton } from './extension/ExtensionsTableButton'
import { useExtensionPopups } from './extension/useExtensionPopups'
import { tableSize } from './panels/PanelConstants'
import { PlayerPanels } from './panels/PlayerPanels'

/** Full starting hand size in a standard game (beginner mode deals 3). */
const STARTING_HAND_SIZE = 5

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
  const rules = useRules<FarawayRules>()
  const playerId = usePlayerId()

  // The extension carousel auto-opens itself on mount. We only want that at the
  // very start of the game — during the initial hand-selection phase, and only
  // while the player still holds their full starting hand (i.e. hasn't chosen a
  // card yet). Gating the mount is what gates the auto-open; the popup stays
  // reachable at any time through the table / journal buttons.
  const showExtensionsPopup = useMemo(() => {
    if (!rules || playerId === undefined) return false
    if (rules.game.rule?.id !== RuleId.ChooseHandCards) return false
    const hand = rules.material(MaterialType.Region).location(LocationType.PlayerRegionHand).player(playerId)
    return hand.length === STARTING_HAND_SIZE
  }, [rules, playerId])

  return (
    <>
      <GameTable {...tableSize}
        verticalCenter
        margin={{ top: 7, left: 0, right: 0, bottom: 0 }} css={process.env.NODE_ENV === 'development' ? borderCss : undefined}>
        <PlayerPanels />
        <ExtensionsTableButton />
        <SwitchViewOnDrag />
        {import.meta.env.DEV && <DevToolsHub><DevCardViewer /></DevToolsHub>}
      </GameTable>
      {showExtensionsPopup && <ExtensionInfoDialog popups={popups} />}
    </>
  )
}

const borderCss = css`
  border: 0.1em solid white;
`
