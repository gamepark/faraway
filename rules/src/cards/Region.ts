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

  // Expansion 1 — list cards in ID order; the first one is used as the range boundary.
  RedExp69 = 1069,
  GreenExp71 = 1171,
  BlueExp75 = 1275,
  YellowExp73 = 1373,
  GrayExp0 = 1400,
  GrayExp70 = 1470,
  GrayExp72 = 1472,
  GrayExp74 = 1474,
  GrayExp76 = 1476,

  // Starry Skies — list cards in ID order; the first one is used as the range boundary.
  RedSky5 = 2005,
  RedSky11 = 2011,
  RedSky21 = 2021,
  GreenSky9 = 2109,
  GreenSky26 = 2126,
  GreenSky33 = 2133,
  BlueSky15 = 2215,
  BlueSky27 = 2227,
  BlueSky32 = 2232,
  YellowSky4 = 2304,
  YellowSky20 = 2320,
  YellowSky38 = 2338,
  GraySky7 = 2407,
  GraySky13 = 2413,
  GraySky29 = 2429
}

export const regions = getEnumValues(Region)

// Range boundaries — keep these pointing to the FIRST card (lowest ID) of each expansion.
// When adding a card with a lower ID than the current boundary, update the constant below.
export const baseGameRegions = regions.filter(r => r < Region.RedExp69)
export const expansion1Regions = regions.filter(r => r >= Region.RedExp69 && r < Region.RedSky5)
export const starrySkiesRegions = regions.filter(r => r >= Region.RedSky5)

export const getColor = (region: Region | Sanctuary): Color => Math.floor((region % 1000) / 100) + 1
export const getValue = (region: Region | Sanctuary): number => (region % 100)
export const isStarrySkies = (region: Region): boolean => region >= Region.RedSky5

/**
 * On exploration-time ties, Starry Skies cards are treated as higher than any other card.
 * Drives placement order in `RoundHelper.turnOrder` and the sanctuary-draw comparison in
 * `SanctuaryHelper`.
 */
export const compareTime = (a: Region, b: Region): number => {
  const valueDiff = getValue(a) - getValue(b)
  if (valueDiff !== 0) return valueDiff
  return (isStarrySkies(a) ? 1 : 0) - (isStarrySkies(b) ? 1 : 0)
}

/**
 * A region card "stays visible" at end-of-game (= face-up during scoring) if:
 * - it is itself a Starry Skies card, OR
 * - its exploration time's ones digit matches the ones digit of any Starry Skies card
 *   in the same player's tableau.
 *
 * Pass `playerCardIds` = the player's full set of region card ids in their line.
 */
export const stayedVisible = (card: Region, playerCardIds: Region[]): boolean => {
  if (isStarrySkies(card)) return true
  const meteorOnes = new Set(
    playerCardIds.filter(isStarrySkies).map(id => getValue(id) % 10)
  )
  return meteorOnes.size > 0 && meteorOnes.has(getValue(card) % 10)
}
