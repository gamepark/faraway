import { getEnumValues } from '@gamepark/rules-api'

/**
 * Beyond the Veil extension: the 13 Spirit cards.
 */
export enum Spirit {
  Axolotl = 1,
  Bat,
  Bear,
  Fish,
  Fox,
  Frog,
  Iguana,
  Monkey,
  Moth,
  Owl,
  Ram,
  Snake,
  Turkey
}

export const spirits = getEnumValues(Spirit)
