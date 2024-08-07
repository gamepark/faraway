import { getEnumValues } from '@gamepark/rules-api'
import { Color } from './Color'
import { Sanctuary } from './Sanctuary'

export enum Region {
  // RED
  Red1 = 1,
  Red4 = 4,
  Red7 = 7,
  Red10 = 10,
  Red14 = 14,
  Red16 = 16,
  Red19 = 19,
  Red23 = 23,  // NIGHT
  Red26 = 26,  // NIGHT
  Red28 = 28,  // NIGHT
  Red30 = 30,  // NIGHT
  Red32 = 32,  // NIGHT
  Red36 = 36,  // NIGHT
  Red39 = 39,  // NIGHT
  Red48 = 48,
  Red52 = 52,
  Red57 = 57,

  // GREEN
  Green3 = 103,
  Green5 = 105,
  Green8 = 108,
  Green11 = 111,
  Green15 = 115,
  Green18 = 118,
  Green20 = 120,  // NIGHT
  Green22 = 122,  // NIGHT
  Green34 = 134,  // NIGHT
  Green38 = 138,  // NIGHT
  Green41 = 141,
  Green45 = 145,
  Green54 = 154,
  Green58 = 158,
  Green61 = 161,
  Green63 = 163,
  Green67 = 167,

  // BLUE
  Blue2 = 202,
  Blue6 = 206,
  Blue9 = 209,
  Blue13 = 213,
  Blue17 = 217,
  Blue21 = 221,  // NIGHT
  Blue24 = 224,  // NIGHT
  Blue40 = 240,  // NIGHT
  Blue43 = 243,
  Blue46 = 246,
  Blue49 = 249,
  Blue51 = 251,
  Blue55 = 255,
  Blue60 = 260,
  Blue64 = 264,
  Blue66 = 266,
  Blue68 = 268,

  // YELLOW
  Yellow12 = 312,
  Yellow25 = 325,  // NIGHT
  Yellow27 = 327,  // NIGHT
  Yellow29 = 329,  // NIGHT
  Yellow31 = 331,  // NIGHT
  Yellow33 = 333,  // NIGHT
  Yellow35 = 335,  // NIGHT
  Yellow37 = 337,  // NIGHT
  Yellow42 = 342,
  Yellow44 = 344,
  Yellow47 = 347,
  Yellow50 = 350,
  Yellow53 = 353,
  Yellow56 = 356,
  Yellow59 = 359,
  Yellow62 = 362,
  Yellow65 = 365,
}

export const regions = getEnumValues(Region)

export const getColor = (region: Region | Sanctuary): Color => Math.floor(region / 100) + 1
export const getValue = (region: Region | Sanctuary): number => (region % 100)

export const isNight = (region: Region): boolean => {
  const value = getValue(region)
  return value <= 40 && value >= 20
}