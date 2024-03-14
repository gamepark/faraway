/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationDescription } from '@gamepark/react-game'
import { RegionScorePointBubble } from './RegionScorePointBubble'

export class RegionScorePointDescription extends LocationDescription {
  height = 2.2
  width = 2.2

  extraCss = css`touch-action: none; pointer-events: none`

  content = RegionScorePointBubble
}