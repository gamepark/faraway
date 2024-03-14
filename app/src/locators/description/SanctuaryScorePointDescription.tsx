/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationDescription } from '@gamepark/react-game'
import { SanctuaryScorePointBubble } from './SanctuaryScorePointBubble'

export class SanctuaryScorePointDescription extends LocationDescription {
  height = 2.2
  width = 2.2

  extraCss = css`touch-action: none; pointer-events: none`

  content = SanctuaryScorePointBubble
}