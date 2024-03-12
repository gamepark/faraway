/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
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
  } else {
    return <span css={location.y === 10 ? totalStyle(location.id) : scoreStyle}>{location.id}</span>
  }
}

const scoreStyle = css`
  font-size: 0.6em;
  color: black;
`

const totalStyle = (score: number) => css`
  font-size: ${score >= 100 ? 0.4 : 0.5}em;
  color: black;
  font-weight: bold;
`

const avatarStyle = css`
  border-radius: 100%;
  height: 0.8em;
  width: 0.8em;
  color: black;
  box-shadow: 0 0 0.1em black;
`