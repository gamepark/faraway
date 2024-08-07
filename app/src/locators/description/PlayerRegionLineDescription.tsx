/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationContext, LocationDescription } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { regionCardDescription } from '../../material/RegionCardDescription'
import { getDeltaForPosition } from '../position/PositionOnTable'

export class PlayerRegionLineDescription extends LocationDescription {
  height = regionCardDescription.height
  width = regionCardDescription.width
  borderRadius = regionCardDescription.borderRadius

  alwaysVisible = true

  extraCss = css`border: 0.05em solid white`

  getCoordinates(location: Location, context: LocationContext): Coordinates | undefined {
    const baseCoordinates = this.getRegionCoordinates(location, context)
    return {
      x: baseCoordinates.x + (regionCardDescription.width + 0.5) * ((location.x!) % 4),
      y: baseCoordinates.y + (regionCardDescription.height + 0.5) * Math.floor((location.x!) / 4),
      z: 0
    }
  }

  getRegionCoordinates(location: Location, context: LocationContext) {
    const { player, rules } = context
    const coordinates = { x: 0, y: 13, z: 0}
    const delta = getDeltaForPosition(location, rules, player)
    return {
      x: coordinates.x + (delta.x ?? 0),
      y: coordinates.y + (delta.y ?? 0),
      z: coordinates.z
    }
  }
}