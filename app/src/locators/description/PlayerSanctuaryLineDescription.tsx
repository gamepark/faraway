/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { LocationContext, LocationDescription, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { sanctuaryCardDescription } from '../../material/SanctuaryCardDescription'
import { getDeltaForPosition } from '../position/PositionOnTable'

export class PlayerSanctuaryLineDescription extends LocationDescription {
  height = sanctuaryCardDescription.height
  width = sanctuaryCardDescription.width
  borderRadius = sanctuaryCardDescription.borderRadius

  alwaysVisible = true

  extraCss = css`border: 0.05em solid white`

  getLocations(context: MaterialContext) {
    const { player } = context
    if (!player) return []
    return [{
      type: LocationType.PlayerSanctuaryLine,
      player
    }]
  }

  getCoordinates(location: Location, context: LocationContext) {
    const { rules } = context
    const sanctuaries = rules.material(MaterialType.Sanctuary).location(LocationType.PlayerSanctuaryLine).player(location.player).length
    const coordinates = this.getSanctuaryCoordinates(location, context)
    const x = sanctuaries % 4
    const y = Math.floor(sanctuaries / 4)
    return {
      x: coordinates.x + (-(sanctuaryCardDescription.width + 0.5) * x),
      y: coordinates.y + ((sanctuaryCardDescription.height + 0.5) * y),
      z: 0
    }
  }

  getSanctuaryCoordinates(location: Location, context: LocationContext) {
    const { player, rules } = context
    const coordinates = { x: -7.5, y: 13, z: 0}
    const delta = getDeltaForPosition(location, rules, player)
    return {
      x: coordinates.x + (delta.x ?? 0),
      y: coordinates.y + (delta.y ?? 0),
      z: coordinates.z
    }
  }
}