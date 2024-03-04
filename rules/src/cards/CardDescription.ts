import { Quest } from './quests/Quest'
import { Wonder } from './Wonder'

export type CardDescription = {
  night?: number
  clue?: number
  wonders?: Wonder[]
  quest?: Quest
}