import { getEnumValues } from '@gamepark/rules-api'

export enum Wonder {
  Rock = 1,
  Chimera,
  Thistle
}

export const wonders = getEnumValues(Wonder)
