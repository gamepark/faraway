import { css, keyframes } from '@emotion/react'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getValue, Region } from '@gamepark/faraway/cards/Region'
import { Regions } from '@gamepark/faraway/cards/Regions'
import { RegionQuests } from '@gamepark/faraway/cards/RegionQuests'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { getRegionCardScore, ScoreHelper } from '@gamepark/faraway/rules/helper/ScoreHelper'
import { Memory } from '@gamepark/faraway/rules/Memory'
import fameIcon from '../images/icon/fame.png'
import { Player } from '@gamepark/react-client'
import {
  Avatar,
  Picture,
  PlayerTimer,
  SpeechBubbleDirection,
  usePlay,
  usePlayerName,
  useRules
} from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC, HTMLAttributes } from 'react'
import Player3 from '../images/region/region_blue_9.jpg'
import Player7 from '../images/region/region_gray_exp_76.jpg'
import Player1 from '../images/region/region_green_11.jpg'
import Player4 from '../images/region/region_red_57.jpg'
import Player2 from '../images/region/region_yellow_27.jpg'
import Player6 from '../images/region/region_yellow_37.jpg'
import Player5 from '../images/region/region_yellow_47.jpg'
import DayMini from '../images/time/day-mini.png'
import Day from '../images/time/day.png'
import NightMini from '../images/time/night-mini.png'
import Night from '../images/time/night.png'

type FarawayPlayerPanelProps = {
  player: Player
  isViewed: boolean
} & HTMLAttributes<HTMLDivElement>

export const FarawayPlayerPanel: FC<FarawayPlayerPanelProps> = ({ player, isViewed, ...rest }) => {
  const play = usePlay()
  const rules = useRules<FarawayRules>()!
  const playerName = usePlayerName(player.id)
  const turnToPlay = rules.isTurnToPlay(player.id)

  const onClick = () => play(MaterialMoveBuilder.changeView(player.id), { transient: true })

  return (
    <div css={[panelPlayerStyle, panelStyle(player.id), isViewed && viewedCss]} onClick={onClick} {...rest}>
      <div css={turnToPlay ? day : night}></div>
      <Avatar css={avatarStyle} playerId={player.id} speechBubbleProps={{ direction: SpeechBubbleDirection.BOTTOM_LEFT }} />
      <h2 css={[nameStyle, data]}>{playerName}</h2>
      <Timer player={player} />
      <PlacedCard player={player} />
      <Score player={player} />
      <ScoringIndicator player={player} />
      {isViewed && <FontAwesomeIcon icon={faEye} css={viewedIconCss} />}
    </div>
  )
}

/**
 * Live score badge for the region card currently being resolved by ScoringRule. Sits to
 * the LEFT of the panel (table side); replaces the old "card flips beside panel" reveal.
 *
 * Sync gate: every panel holds back until EVERY card at the current scoring x is
 * revealed (rotation === true and id known). Two reasons we can't just gate per-panel:
 *  - the viewer's own card animates at 800ms while non-viewed rotations are duration 0,
 *    so per-card gates would stagger the pop-ins by the flip duration;
 *  - when the viewer has a Starry Skies card already face-up at this x (rotation true
 *    from the start), their bubble would appear before any other player's reveal lands.
 * Players without a card at this x simply never render a bubble.
 */
const ScoringIndicator: FC<{ player: Player }> = ({ player }) => {
  const rules = useRules<FarawayRules>()
  const currentX = rules?.game.memory?.[Memory.CurrentScoringX] as number | undefined
  if (typeof currentX !== 'number') return null

  const cardIndexes = rules!
    .material(MaterialType.Region)
    .location(LocationType.PlayerRegionLine)
    .player(player.id)
    .location(loc => loc.x === currentX)
    .getIndexes()
  if (cardIndexes.length === 0) return null
  const cardIndex = cardIndexes[0]
  const item = rules!.material(MaterialType.Region).getItem<Region>(cardIndex)
  if (item.id === undefined) return null

  const allRevealed = rules!.material(MaterialType.Region)
    .location(LocationType.PlayerRegionLine)
    .location(loc => loc.x === currentX)
    .getItems()
    .every(i => i.location.rotation === true && i.id !== undefined)
  if (!allRevealed) return null

  const quest = RegionQuests[item.id]
  // Cards without a quest still show a bubble but with a "/" placeholder — matches the
  // scoresheet's `'/'` for the same case so the two views stay in sync.
  const score: number | string = quest && item.location.player !== undefined
    ? getRegionCardScore(rules!.game, cardIndex)
    : '/'
  return (
    <div css={scoringIndicatorCss} key={cardIndex}>
      <div css={fameBadgeCss}>{score}</div>
    </div>
  )
}

const Timer: FC<{ player: Player }> = ({ player }) => {
  const rules = useRules<FarawayRules>()!
  if (rules?.isOver()) return null
  return <PlayerTimer customStyle={[(playing) => !playing && css`color: lightgray !important;`]} playerId={player.id} css={[timerStyle, data]} />
}

/**
 * Running score badge: shows the live total as scoring reveals cards, and the final total
 * once the game is over. Hidden during regular play (no scoring x set, game not over).
 *
 * Partial total sums:
 *  - region quests for cards that are already face-up (`rotation === true`) — naturally
 *    matches the per-card bubble visibility, so the panel total goes up at the same moment
 *    the per-card bubbles appear.
 *  - sanctuary quests, but only when no region is still face-down. Sanctuary quests often
 *    depend on the full region tableau, so we wait until everything is revealed before
 *    folding them in.
 */
const Score: FC<{ player: Player }> = ({ player }) => {
  const rules = useRules<FarawayRules>()!
  const total = new ScoreHelper(rules.game, player.id).runningTotal(rules.isOver())
  if (total === undefined) return null

  return (
    <span css={[placedCard, data]}>
      <FontAwesomeIcon icon={faStar} css={scoreStyle} fill="#28B8CE" />
      <span>{total}</span>
    </span>
  )
}

const PlacedCard: FC<{ player: Player }> = ({ player }) => {
  const rules = useRules<FarawayRules>()!
  const round = rules.remind(Memory.Round)
  const speedDisabled = player.time?.availableTime === undefined
  const currentX = rules?.game.memory?.[Memory.CurrentScoringX] as number | undefined
  const card = rules
    .material(MaterialType.Region)
    .location((l) => l.type === LocationType.PlayerRegionLine && l.x === (round - 1))
    .player(player.id)
    .getItem<Region>()

  // Hide during the scoring phase or after game over — the Score component takes over there.
  if (!card?.id || !rules?.game.rule || currentX !== undefined || rules.isOver()) return null
  const night = Regions[card.id]?.night === 1
  return (
    <span css={[data, placedCard, speedDisabled && rightAlignment]}>
      <Picture css={timeMini} src={night ? NightMini : DayMini} />
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
  align-items: center;
  height: 1.35em;

  > span {
    text-align: right;
    width: 1.7em;
  }
`

const scoreStyle = css`
  color: #28B8CE;
`

const popIn = keyframes`
  0%   { opacity: 0; transform: translateY(-50%) scale(0.88); }
  100% { opacity: 1; transform: translateY(-50%) scale(1); }
`

/**
 * Sized to ~6em — matches roughly the panel's vertical real-estate left of the avatar
 * so the score is the eye-catcher during scoring. Sits to the LEFT of the panel; its
 * right edge lines up with the avatar's left edge. Centred a hair above the avatar's
 * exact midline so the lower-right arrow can land near the middle of the avatar.
 */
const scoringIndicatorCss = css`
  position: absolute;
  right: 100%;
  top: 1em;
  transform: translateY(-50%);
  width: 5em;
  height: 5em;
  font-size: 1.4em;
  z-index: 5;
  pointer-events: none;
  animation: ${popIn} 0.55s cubic-bezier(.2, .8, .4, 1);
`

/**
 * Same fame.png medal style as the on-card RegionScorePointBubble, with an asymmetric
 * arrow at the bottom-right pointing toward the avatar.
 */
const fameBadgeCss = css`
  background-image: url(${fameIcon});
  background-size: cover;
  width: 100%;
  height: 100%;
  color: black;
  font-weight: bold;
  font-size: 2.4em;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  /* Solid white triangle via clip-path rather than CSS borders. The previous
     border-triangle had a transparent top edge, which let the medal's darker rim
     pixels show through and read as a thin black line on the left of the arrow. */
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 0.55em;
    margin-right: -0.25em;
    width: 0.6em;
    height: 0.4em;
    background: white;
    clip-path: polygon(0 0, 100% 100%, 0 100%);
  }
`

const panelPlayerStyle = css`
  position: relative;
  width: 28em;
  height: 8.3em;
  color: black;
  border-radius: 3em 1.5em 1.5em 1.5em;
  box-shadow: 0 0 0.5em black, 0 0 0.5em black;
  cursor: pointer;
  transform-origin: center top;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`

const viewedCss = css`
  transform: scale(1.04);
  box-shadow: 0 0 0.5em black, 0 0 0 0.2em #F0D860;
`

const viewedIconCss = css`
  position: absolute;
  bottom: -1em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  font-size: 1.4em;
  color: #F0D860;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.25em 0.5em;
  border-radius: 0.5em;
  box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.4);
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
  Player6,
  Player7
]

const panelStyle = (playerId: PlayerId) => css`
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
  }
`

const data = css`
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.1em 0.3em;
  border-radius: 0.4em;
  z-index: 2;
`

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
`

const timerStyle = css`
  position: absolute;
  bottom: 0.2em;
  left: initial;
  right: 4.1em;
  font-size: 2.5em;
`
