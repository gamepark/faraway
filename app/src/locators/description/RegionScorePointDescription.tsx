/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationDescription } from '@gamepark/react-game'
import { RegionScorePointBubble } from './RegionScorePointBubble'

export class RegionScorePointDescription extends LocationDescription {
  height = 3
  width = 3

  extraCss = css`touch-action: none; pointer-events: none`

  content = RegionScorePointBubble
}