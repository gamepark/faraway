import { isEnumValue } from '@gamepark/rules-api'

export enum Sanctuary {
  // RED
  Red1 = 1,
  Red2,
  Red3,
  Red4,
  Red5,

  // GREEN
  Green1 = 101,
  Green2,
  Green3,
  Green4,
  Green5,

  // BLUE
  Blue1 = 201,
  Blue2,
  Blue3,
  Blue4,
  Blue5,

  // YELLOW
  Yellow1 = 301,
  Yellow2,
  Yellow3,
  Yellow4,
  Yellow5,

  // GRAY
  Gray1 = 401,
  Gray2,
  Gray3,
  Gray4,
  Gray5,
  Gray6,
  Gray7,
  Gray8,
  Gray9,
  Gray10,
  Gray11,
  Gray12,
  Gray13,
  Gray14,
  Gray15,
  Gray16,
  Gray17,
  Gray18,
  Gray19,
  Gray20,
  Gray21,
  Gray22,
  Gray23,
  Gray24,
  Gray25,
}

export const sanctuaries = Object.values(Sanctuary).filter(isEnumValue)