import { css, keyframes } from '@emotion/react'
import { Avatar, LocationDescription } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

export class ScoreSheetBoxDescription extends LocationDescription {
  height = 0.8
  width = 1

  extraCss = css`
    touch-action: none;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  content = ScoreDisplay

  displayInParentItemHelp = true
}

const ScoreDisplay = ({ location }: { location: Location }) => {
  if (location.y === 0) {
    return <Avatar css={avatarStyle} playerId={location.x}/>
  }
  return <span css={location.y === 10 ? totalStyle(location.id) : scoreStyle}>{location.id}</span>
}

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.88); }
  100% { opacity: 1; transform: scale(1); }
`

const scoreStyle = css`
  font-size: 0.6em;
  color: black;
  animation: ${popIn} 0.55s cubic-bezier(.2, .8, .4, 1);
`

const totalStyle = (score: number) => css`
  font-size: ${score >= 100 ? 0.4 : 0.5}em;
  color: black;
  font-weight: bold;
  animation: ${popIn} 0.55s cubic-bezier(.2, .8, .4, 1);
`

const avatarStyle = css`
  border-radius: 100%;
  height: 0.8em;
  width: 0.8em;
  color: black;
  box-shadow: 0 0 0.1em black;
`