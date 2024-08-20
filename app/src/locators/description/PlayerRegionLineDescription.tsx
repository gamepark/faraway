/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { DropAreaDescription } from '@gamepark/react-game'
import { regionCardDescription } from '../../material/RegionCardDescription'

export class PlayerRegionLineDescription extends DropAreaDescription {
  height = regionCardDescription.height
  width = regionCardDescription.width
  borderRadius = regionCardDescription.borderRadius

  alwaysVisible = true

  extraCss = css`border: 0.05em solid white`
}