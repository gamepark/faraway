/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { LocationContext, LocationDescription, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { regionCardDescription } from '../../material/RegionCardDescription'

export class PlayerRegionLineDescription extends LocationDescription {
  height = regionCardDescription.height
  width = regionCardDescription.width
  borderRadius = regionCardDescription.borderRadius

  alwaysVisible = true

  extraCss = css`border: 0.05em solid white`

  getLocations(context: MaterialContext) {
    const { rules } = context
    return rules.players.flatMap((p) => Array.from(Array(8))
      .map((_, x) => ({
        type: LocationType.PlayerRegion,
        player: p,
        x: x
      })))
  }

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
    if (location.player === (player ?? rules.players[0])) {
      return { x: 0, y: 13, z: 0}
    }

    return { x: 0, y: -13, z: 0}
  }
}