/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { DropAreaDescription } from '@gamepark/react-game'
import { regionCardDescription } from '../../material/RegionCardDescription'

export class PlayerRegionAreaDescription extends DropAreaDescription {
  constructor() {
    super(regionCardDescription)
  }

  extraCss = css`background-color: rgba(255, 255, 255, 0.2);`
}