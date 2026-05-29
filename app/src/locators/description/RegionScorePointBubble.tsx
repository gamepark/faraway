import { css, keyframes } from '@emotion/react'
import { Region } from '@gamepark/faraway/cards/Region'
import { RegionQuests } from '@gamepark/faraway/cards/RegionQuests'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { getRegionCardScore } from '@gamepark/faraway/rules/helper/ScoreHelper'
import { useRules } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { FC } from 'react'
import fame from '../../images/icon/fame.png'

type RegionScorePointBubbleProps = {
  location: Location
  /** Direction the arrow points to (defaults to 'left' for the on-card placement). */
  arrow?: 'left' | 'right' | 'none'
}

export const RegionScorePointBubble: FC<RegionScorePointBubbleProps> = (props) => {
  const { location, arrow = 'left' } = props
  const rules = useRules<FarawayRules>()!
  const item = rules?.material(MaterialType.Region).getItem<Region>(location.parent!)
  const quest = item.id !== undefined ? RegionQuests[item.id] : undefined
  // On the line, ScoringRule rotates each card face-up at its tick; before that
  // HideRegionLineRule has flipped them face-down. So `rotation === true` is the
  // cleanest "card has been revealed" gate — keeps the bubble in sync with the flip
  // without depending on animation-tracking. Outside the line (overview rendering,
  // etc.) we don't want to gate on rotation, so the check is scoped to the line.
  const onLine = item.location.type === LocationType.PlayerRegionLine
  if (!quest || (onLine && item.location.rotation !== true)) return null
  const score = getRegionCardScore(rules.game, location.parent!)
  return <ScoreBubble score={score} arrow={arrow}/>
}

type ScoreBubbleProps = {
  score: number | string
  arrow?: 'left' | 'right' | 'none'
}

/** Reusable bubble (background image + score). Decoupled from useRules so
 *  it can be used from log entries that need to display a historical score. */
export const ScoreBubble: FC<ScoreBubbleProps> = ({ score, arrow = 'none' }) => (
  <div css={[scoreStyle, arrow === 'left' && arrowLeftCss, arrow === 'right' && arrowRightCss]}>
    {score}
  </div>
)

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.88); }
  100% { opacity: 1; transform: scale(1); }
`

const scoreStyle = css`
  background-image: url(${fame});
  background-size: cover;
  width: 100%;
  height: 100%;
  color: black;
  font-weight: bold;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0.1em 0.1em black);
  position: relative;
  animation: ${popIn} 0.55s cubic-bezier(.2, .8, .4, 1);
`

const arrowBaseCss = css`
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    bottom: 0;
    margin-bottom: 0.4em;
    border-top-width: 0.4em;
    border-bottom: 0;
  }
`

const arrowLeftCss = css`
  ${arrowBaseCss};
  &:after {
    left: 0;
    margin-left: -0.3em;
    border-right-color: white;
    border-right-width: 0.6em;
    border-left: 0;
  }
`

const arrowRightCss = css`
  ${arrowBaseCss};
  &:after {
    right: 0;
    margin-right: -0.3em;
    border-left-color: white;
    border-left-width: 0.6em;
    border-right: 0;
  }
`
