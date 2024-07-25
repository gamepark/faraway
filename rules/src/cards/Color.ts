import { isEnumValue } from '@gamepark/rules-api'

export enum Color {
  Red = 1,
  Green,
  Blue,
  Yellow,
}

export const colors = Object.values(Color).filter(isEnumValue)