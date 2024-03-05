/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationDescription } from '@gamepark/react-game'
import { SanctuaryScorePointBubble } from './SanctuaryScorePointBubble'

export class SanctuaryScorePointDescription extends LocationDescription {
  height = 3
  width = 2

  extraCss = css`touch-action: none; pointer-events: none`

  content = SanctuaryScorePointBubble
}