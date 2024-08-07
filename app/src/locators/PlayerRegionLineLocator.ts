/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { FlexLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'
import { PlayerRegionLineDescription } from './description/PlayerRegionLineDescription'

export class PlayerRegionLineLocator extends FlexLocator {
  itemsPerLine = 4
  itemsGap = { x: regionCardDescription.width + 0.5 }
  linesGap = { y: regionCardDescription.height + 0.5 }

  locationDescription = new PlayerRegionLineDescription()

  getLocations(context: MaterialContext) {
    const { rules } = context
    return rules.players.flatMap((p) => Array.from(Array(8))
      .map((_, x) => ({
        type: LocationType.PlayerRegionLine,
        player: p,
        x: x
      })))
  }

  getCoordinates(item: MaterialItem, context: ItemContext) {
    const { location } = item
    return {
      ...this.locationDescription.getRegionCoordinates(location, context),
      z: 0.05
    }
  }

  // TODO: allow to hide card on location but not in modal
  getRotations(item: MaterialItem, context: ItemContext): string[] {
    const rotateZ = this.getRotateZ(item, context)
    const rotations =  !item.location.rotation? ['rotateY(180deg)']: (context.material[context.type]?.getRotations(item, context) ?? [])
    return rotateZ ? [`rotateZ(${rotateZ}${this.rotationUnit})`, ...rotations] : rotations
  }
}

export const playerRegionLineLocator = new PlayerRegionLineLocator()