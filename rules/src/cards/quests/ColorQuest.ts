import { MaterialGame } from '@gamepark/rules-api'
import { PlayerId } from '../../PlayerId'
import { Color } from '../Color'
import { Wonder } from '../Wonder'
import { Quest } from './Quest'

export class ColorQuest extends Quest {
  constructor(readonly points: number, readonly colors: Color[], readonly wonders: Wonder[] = []) {
    super(points, wonders)
  }

  getScore(_game: MaterialGame, _playerId: PlayerId): number | undefined {
    return undefined
  }
}