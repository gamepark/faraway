import { OptionsSpec, OptionsSpecV2, OptionsValidationError } from '@gamepark/rules-api'

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

/**
 * The legacy declaration, superseded by `FarawayOptionsSpecV2`.
 *
 * Kept exported only because a few platform screens still read the v1 spec for
 * its labels; nothing here should be edited any more, and the whole object goes
 * once those screens have moved. `validate` is dead code for game creation
 * already: the platform generates from the v2 spec, which no longer offers a
 * table this function would refuse.
 */
export const FarawayOptionsSpec: OptionsSpec<FarawayOptions> = {
  beginner: {
    label: t => t('beginner'),
    help: t => t('beginner.help'),
    competitiveDisabled: true
  },
  expansion1: {
    label: t => t('expansion1'),
    help: t => t('expansion1.help'),
    subscriberRequired: false
  },
  starrySkies: {
    label: t => t('starrySkies'),
    help: t => t('starrySkies.help'),
    subscriberRequired: false
  },
  validate: (options, t) => {
    if (!options.expansion1) {
      // Only the seventh seat needs the expansion: the base game plays up to six.
      if (options.players && options.players > 6) {
        throw new OptionsValidationError(t('7.players.requires.expansion'), ['expansion1', 'players'])
      }
    }
  }
}