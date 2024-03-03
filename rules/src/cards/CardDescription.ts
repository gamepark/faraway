import { Quest } from './quests/Quest'
import { Wonder } from './Wonder'

export type CardDescription = {
  clue?: number
  wonders?: Wonder[]
  quest?: Quest
}