import { OptionsSpec, OptionsValidationError } from '@gamepark/rules-api'

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export type FarawayOptions = {
  beginner: boolean
  expansion1: boolean
  players: number
}

/**
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for you game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
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
    subscriberRequired: true
  },
  validate: (options, t) => {
    if (!options.expansion1) {
      if (options.players && options.players > 5) {
        throw new OptionsValidationError(t('7.players.requires.expansion'), ['expansion1', 'players'])
      }
    }
  }
}