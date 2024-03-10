/** @jsxImportSource @emotion/react */
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { ItemLocator, LocationDescription } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import DayMini from '../images/time/day-mini.png'
import Day from '../images/time/day.png'
import NightMini from '../images/time/night-mini.png'
import Night from '../images/time/night.png'
import Biome from '../images/tutorial/biomes.jpg'
import Clue from '../images/icon/clue.png'
import Rock from '../images/icon/rock.png'
import { regionCardDescription } from '../material/RegionCardDescription'

export enum Characteristic {
  Time = 1, Biome, Clue
}

class CardCharacteristicDescription extends LocationDescription {

  getBorderRadius(location: Location) {
    if (location.id === Characteristic.Time) return 1
    if (location.id === Characteristic.Clue) return 0.3
    return 0
  }



  getSize(location: Location) {
    if (location.id === Characteristic.Time) return { height: 1.9, width: 1.9}
    if (location.id === Characteristic.Clue) return { height: 1.2, width: 1.4}
    return { height: 2.7, width: regionCardDescription.width }
  }
}

export const cardCharacteristicDescription = new CardCharacteristicDescription()

export class CardCharacteristicLocator extends ItemLocator {
  locationDescription = cardCharacteristicDescription
  parentItemType = MaterialType.Region

  getImages() {
    return [
      Biome,
      Night,
      NightMini,
      Day,
      DayMini,
      Clue,
      Rock
    ]
  }

  getPositionOnParent(location: Location) {
    if (location.id === Characteristic.Time) return { x: 15, y: 14.5}
    if (location.id === Characteristic.Clue) return { x: 36, y: 14.5}
    return { x: 50, y: 81}
  }
}

export const cardCharacteristicLocator = new CardCharacteristicLocator()

