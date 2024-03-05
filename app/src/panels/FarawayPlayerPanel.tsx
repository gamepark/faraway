/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { Player } from '@gamepark/react-client'
import { PlayerPanel, useFocusContext, usePlayerId, useRules } from '@gamepark/react-game'
import { FC, HTMLAttributes, useCallback } from 'react'
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
        rules.material(MaterialType.Region).player(player.id),
        rules.material(MaterialType.Sanctuary).player(player.id),
        ...(itsMe ? [rules.material(MaterialType.Region).location(LocationType.Region)]: [])
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

  return (
    <PlayerPanel onClick={focusPlayer} playerId={player.id} css={panelStyle} { ...rest} />
  )
}

const panelStyle = css`
  cursor: pointer;
`

const getMargin = (rules: FarawayRules, player: Player, playerId?: PlayerId) => {
  const itsMe = playerId && player.id === playerId
  const index = computeBoardIndex({ player: player.id }, rules, playerId)
  switch (index) {
    case 0:
      const smallTop = rules.players.length <= 5
      const smallBottom = rules.players.length === 2
      return {
        top: smallTop? 1: 5,
        bottom: smallBottom? 1: 4,
        left: 3
      }
    case 1:
      return {
        top: 3,
        bottom: rules.players.length < 5? 1: 4,
        left: itsMe? 15: 0
      }
    case 2:
      return {
        top: 3,
        bottom: rules.players.length < 5? 1: 4,
        right: rules.players.length < 5? 5: 0
      }
    case 3:
      return {
        top: 2,
        bottom: 4,
        right: rules.players.length > 4? 5: 0
      }
    case 4:
      return {
        top: 4,
        bottom: 2,
        right: 5
      }
    case 5:
      return {
        top: 4,
        bottom: 2
      }
  }

  return {

  }
}