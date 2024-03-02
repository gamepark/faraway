import { isEnumValue } from '@gamepark/rules-api'

export enum Color {
  Red = 1,
  Green,
  Blue,
  Yellow,
  Gray
}

export const colors = Object.values(Color).filter((c) => c === Color.Gray && isEnumValue(c))