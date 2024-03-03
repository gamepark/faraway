import { MaterialGame } from '@gamepark/rules-api'
import { PlayerId } from '../../PlayerId'
import { Wonder } from '../Wonder'

export abstract class Quest {

  constructor(readonly points: number, readonly wonders: Wonder[] = []) {
  }


  abstract getScore(_game: MaterialGame, _playerId: PlayerId): number | undefined
}