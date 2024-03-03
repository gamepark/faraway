import { MaterialGame } from '@gamepark/rules-api'
import { PlayerId } from '../../PlayerId'
import { Quest } from './Quest'

export class ThistleQuest extends Quest {

  getScore(_game: MaterialGame, _playerId: PlayerId): number | undefined {
    return undefined
  }
}