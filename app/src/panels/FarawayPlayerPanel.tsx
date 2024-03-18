/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getValue } from '@gamepark/faraway/cards/Region'
import { Regions } from '@gamepark/faraway/cards/Regions'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { ScoreHelper } from '@gamepark/faraway/rules/helper/ScoreHelper'
import { Memory } from '@gamepark/faraway/rules/Memory'
import { Player, useOptions } from '@gamepark/react-client'
import { Avatar, Picture, PlayerTimer, SpeechBubbleDirection, useFocusContext, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { GameSpeed } from '@gamepark/rules-api'
import { FC, HTMLAttributes, useCallback, useEffect } from 'react'
import Player3 from '../images/region/region_blue_9.jpg'
import Player1 from '../images/region/region_green_11.jpg'
import Player4 from '../images/region/region_red_57.jpg'
import Player2 from '../images/region/region_yellow_27.jpg'
import Player6 from '../images/region/region_yellow_37.jpg'
import Player5 from '../images/region/region_yellow_47.jpg'
import DayMini from '../images/time/day-mini.png'
import Day from '../images/time/day.png'
import NightMini from '../images/time/night-mini.png'
import Night from '../images/time/night.png'
import { computeBoardIndex } from '../locators/position/PositionOnTable'

type FarawayPlayerPanelProps = {
  player: Player
} & HTMLAttributes<HTMLDivElement>

export const FarawayPlayerPanel: FC<FarawayPlayerPanelProps> = (props) => {
  const { player, ...rest } = props
  const { setFocus } = useFocusContext()
  const rules = useRules<FarawayRules>()!
  const isTutorial = !rules || rules.game.tutorialStep !== undefined
  const playerId = usePlayerId()
  const playerName = usePlayerName(player.id)
  const itsMe = playerId && player.id === playerId
  const turnToPlay = rules.isTurnToPlay(player.id)
  const focusPlayer = useCallback(() => {
    setFocus({
      materials: [
        ...(itsMe ? [rules.material(MaterialType.Region).location(LocationType.Region)] : []),
        ...(itsMe ? [rules.material(MaterialType.Region).location(LocationType.RegionDeck).maxBy((item) => item.location.x!)] : []),
        ...(itsMe ? [rules.material(MaterialType.Region).location(LocationType.PlayerRegionHand).player(playerId)] : []),
      ],
      staticItems: [],
      locations:
        Array.from(Array(8))
          .map((_, x) => ({
            type: LocationType.PlayerRegionLine,
            player: player.id,
            x: x
          })),
      margin: getMargin(rules, player, playerId),
      animationTime: 500
    })
  }, [rules, player])

  useEffect(() => {
    if (itsMe && !isTutorial) {
      setTimeout(focusPlayer, 3000)
    }

  }, [itsMe, playerId, setFocus, isTutorial])
  return (
    <>
      <div css={[panelPlayerStyle, panelStyle(player.id)]} onClick={focusPlayer} {...rest}>
        <div css={turnToPlay ? day : night}></div>
        <Avatar css={avatarStyle} playerId={player.id} speechBubbleProps={{ direction: SpeechBubbleDirection.BOTTOM_LEFT }}/>
        <h2 css={[nameStyle, data]}>{playerName}</h2>
        <Timer {...props} />
        <PlacedCard {...props} />
        <Score {...props} />
      </div>

    </>
  )
}

const Timer: FC<FarawayPlayerPanelProps> = (props) => {
  const { player } = props
  const rules = useRules<FarawayRules>()!

  if (rules?.isOver()) return null

  return <PlayerTimer customStyle={[(playing) => !playing && css`color: lightgray !important;`]} playerId={player.id} css={[timerStyle, data]}/>
}

const Score: FC<FarawayPlayerPanelProps> = (props => {
  const { player } = props
  const rules = useRules<FarawayRules>()!

  if (!rules?.isOver()) return null

  return (
    <span css={[placedCard, data]}>
      <FontAwesomeIcon icon={faStar} css={scoreStyle} fill="#28B8CE"/>
      <span>{new ScoreHelper(rules.game, player.id).score}</span>
    </span>
  )
})

const PlacedCard: FC<FarawayPlayerPanelProps> = (props) => {
  const { player } = props
  const rules = useRules<FarawayRules>()!
  const round = rules.remind(Memory.Round)
  const options = useOptions()
  const speedDisabled = options?.speed !== GameSpeed.RealTime || !player?.time
  const card = rules
    .material(MaterialType.Region)
    .location((l) => l.type === LocationType.PlayerRegionLine && l.x === (round - 1))
    .player(player.id)
    .getItem()


  if (!card?.id || !rules?.game.rule) return null
  const night = Regions[card?.id]?.night === 1
  return (
    <span css={[data, placedCard, speedDisabled && rightAlignment]}>
      <Picture css={timeMini} src={night ? NightMini : DayMini}/>
      <span>{getValue(card.id)}</span>
    </span>
  )
}

const rightAlignment = css`
  bottom: 0.2em;
  left: initial;
  right: 0.25em;
  font-size: 2.5em;
`
const timeMini = css`
  height: 1.05em;
  margin-bottom: -0.17em;
  border: 0.01em solid white;
  border-radius: 5em;
`

const placedCard = css`
  position: absolute;
  width: 3.5em;
  font-size: 2.5em;
  bottom: 0.2em;
  left: initial;
  right: 0.25em;
  display: flex;
  height: 1.35em;

  > span {
    text-align: right;
    width: 1.7em;
  }
`

const scoreStyle = css`
  color: #28B8CE
`

const panelPlayerStyle = css`
  color: black;
  border-radius: 3em 1.5em 1.5em 1.5em;
  box-shadow: 0 0 0.5em black, 0 0 0.5em black;
`

const avatarStyle = css`
  position: absolute;
  top: -0.1em;
  left: 0;
  border-radius: 100%;
  height: 6em;
  width: 6em;
  color: black;
  z-index: 1;
`
const nameStyle = css`
  position: absolute;
  top: 0.3em;
  left: initial;
  right: 0.3em;
  max-width: 7.3em;
  font-size: 2.4em;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const PlayerBackground = [
  Player1,
  Player2,
  Player3,
  Player4,
  Player5,
  Player6
]

const panelStyle = (playerId: PlayerId) => css`
  cursor: pointer;

  background: rgba(0, 0, 0, 0.8) url(${PlayerBackground[playerId - 1]}) no-repeat -8.6em -4.7em;
  background-size: 150% auto;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    left: 0;
    border-radius: 1em;
    //background-color: rgba(255, 255, 255, 0.3);
  }
`

const data = css`
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.1em 0.3em;
  border-radius: 0.4em;
  z-index: 2;
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

const day = css`
  position: absolute;
  top: -1em;
  left: -1.55em;
  height: 7.9em;
  width: 8.4em;
  background-size: contain;
  background-image: url(${Day});
  background-repeat: no-repeat;

  &:after {
    content: ' ';
    position: absolute;
    top: 36%;
    left: 0;
    width: 2.1em;
    height: 2.1em;
    background-image: url(${DayMini});
    background-size: cover;
    z-index: 2;
  }
`

const night = css`
  position: absolute;
  top: -1em;
  left: -0.85em;
  height: 7.9em;
  width: 8.4em;
  background-size: contain;
  background-image: url(${Night});
  background-repeat: no-repeat;

  &:after {
    content: ' ';
    position: absolute;
    top: 37%;
    right: 0;
    width: 1.8em;
    height: 1.8em;
    background-image: url(${NightMini});
    background-size: cover;
    z-index: 2;
  }
}
`

const timerStyle = css`
  position: absolute;
  bottom: 0.2em;
  left: initial;
  right: 4.1em;
  font-size: 2.5em;
`