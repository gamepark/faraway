/** @jsxImportSource @emotion/react */
import { FlexLocator, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { regionCardDescription } from '../material/RegionCardDescription'
import { PlayerRegionLineDescription } from './description/PlayerRegionLineDescription'

export class PlayerRegionLineLocator extends FlexLocator {
  itemsPerLine = 4
  itemsGap = { x: regionCardDescription.width + 0.5 }
  linesGap = { y: regionCardDescription.height + 0.5 }

  locationDescription = new PlayerRegionLineDescription()

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