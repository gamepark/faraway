/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { Player } from '@gamepark/react-client'
import { PlayerPanel, useFocusContext, usePlayerId, useRules } from '@gamepark/react-game'
import { FC, HTMLAttributes, useCallback, useEffect } from 'react'
import { computeBoardIndex } from '../locators/position/PositionOnTable'

type FarawayPlayerPanelProps = {
  player: Player
} & HTMLAttributes<HTMLDivElement>

export const FarawayPlayerPanel: FC<FarawayPlayerPanelProps> = (props) => {
  const { player, ...rest } = props
  const { setFocus } = useFocusContext()
  const rules = useRules<FarawayRules>()!
  const playerId = usePlayerId()
  const itsMe = playerId && player.id === playerId
  const focusPlayer = useCallback(() => {
    setFocus({
      materials: [
        ...(itsMe ? [rules.material(MaterialType.Region).location(LocationType.Region)]: []),
        ...(itsMe ? [rules.material(MaterialType.Region).location(LocationType.PlayerRegionHand).player(playerId)]: [])
      ],
      staticItems: [],
      locations:
        Array.from(Array(8))
          .map((_, x) => ({
            type: LocationType.PlayerRegionLine,
            player: player.id,
            x: x
          })),
      margin: getMargin(rules, player, playerId)
    })
  }, [rules, player])

  useEffect(() => {
    if (itsMe) {
      setTimeout(focusPlayer, 3000)
    }

  }, [itsMe])

  return (
    <PlayerPanel onClick={focusPlayer} playerId={player.id} css={panelStyle} {...rest} />
  )
}

const panelStyle = css`
  cursor: pointer;
`

const getMargin = (rules: FarawayRules, player: Player, playerId?: PlayerId) => {
  const index = computeBoardIndex({ player: player.id }, rules, playerId)
  const margin = {
    left: 23,
    right: 2,
    top: 2,
    bottom: 3
  }

  if (index === 0 && rules.players.length > 3) {
    margin.top = 4
    margin.bottom = 1
  }

  if (index === 0 && rules.players.length === 5) {
    margin.top = 5
    margin.bottom = 1
  }

  if (index === 0 && rules.players.length === 6) {
    margin.top = 5
    margin.bottom = 4
  }

  return margin
}