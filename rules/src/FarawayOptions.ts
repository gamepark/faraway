import { OptionsSpecV2 } from '@gamepark/rules-api'

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export type FarawayOptions = {
  beginner: boolean
  expansion1: boolean
  starrySkies: boolean
  players: number
}

/**
 * What Faraway is: three independent variants, one of which the larger tables
 * cannot do without.
 *
 * That last constraint is not a cross rule but an availability: turning the
 * expansion *off* is what stops existing past six players, so the `false` side
 * of the option carries a `playerCount` and the platform simply stops offering
 * it above it. Declared this way it is enforced before the question is asked,
 * where `validate` could only reject the answer afterwards.
 *
 * The threshold is six, not five: the base game plays up to six, and only the
 * seventh seat needs the expansion — which is what the message key has said all
 * along. The old `validate` tested `players > 5` and so refused a legal
 * six-player base game; both now agree.
 */
export const FarawayOptionsSpecV2: OptionsSpecV2 = {
  specVersion: 2,
  players: { min: 2, max: 7 },
  options: {
    beginner: { kind: 'boolean' },
    expansion1: { kind: 'boolean', values: [{ value: false, playerCount: { max: 6 } }, true] },
    starrySkies: { kind: 'boolean' }
  }
}
