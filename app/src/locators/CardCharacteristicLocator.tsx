/** @jsxImportSource @emotion/react */
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { ItemLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

export enum CombatIcon {
  Attack = 1, Defense
}

export class CardCharacteristicLocator extends ItemLocator {
  parentItemType = MaterialType.Region

  getPositionOnParent(location: Location) {
    return location.id === CombatIcon.Attack ? { x: 18.5, y: 66.6 } : { x: 81.8, y: 66.6 }
  }
}

export const cardCharacteristicLocator = new CardCharacteristicLocator()
