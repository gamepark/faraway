/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { LocationContext, LocationDescription, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { sanctuaryCardDescription } from '../../material/SanctuaryCardDescription'
import { getDeltaForPosition } from '../position/PositionOnTable'

export class PlayerSanctuaryLineDescription extends LocationDescription {
  width = sanctuaryCardDescription.width * 3 + 1
  height = sanctuaryCardDescription.height * 2 + 0.5
  borderRadius = sanctuaryCardDescription.borderRadius

  getLocations({ player }: MaterialContext) {
    return player ? [{ type: LocationType.PlayerSanctuaryLine, player }] : []
  }

  getCoordinates(location: Location, context: LocationContext) {
    const { x, y, z } = this.getSanctuaryCoordinates(location, context)
    return {
      x: x - (this.width - sanctuaryCardDescription.width) / 2,
      y: y + (this.height - sanctuaryCardDescription.height) / 2,
      z
    }
  }

  getSanctuaryCoordinates(location: Location, context: LocationContext) {
    const { player, rules } = context
    const coordinates = { x: -7.5, y: 13, z: 0 }
    const delta = getDeltaForPosition(location, rules, player)
    return {
      x: coordinates.x + (delta.x ?? 0),
      y: coordinates.y + (delta.y ?? 0),
      z: coordinates.z
    }
  }
}