import { CardDescription } from './CardDescription'
import { Criterion } from './Criterion'
import { Spirit } from './Spirit'
import { Wonder } from './Wonder'

export type SpiritDescription = CardDescription & {
  /** Acquisition condition: have at least `count` of `criterion` in your Region and Sanctuary cards */
  condition: { criterion: Criterion, count: number }
  /** Additional points */
  points?: number
  /** Additional points for each `criterion` visible on your cards */
  bonus?: { criterion: Criterion, points: number }
}

export const Spirits: Record<Spirit, SpiritDescription> = {
  [Spirit.Axolotl]: {
    wonders: [Wonder.Chimera, Wonder.Thistle],
    condition: { criterion: Criterion.NoResourceCard, count: 4 },
    points: 3
  },
  [Spirit.Bat]: {
    clue: 1,
    condition: { criterion: Criterion.RedCard, count: 3 },
    points: 5,
    bonus: { criterion: Criterion.Night, points: 2 }
  },
  [Spirit.Bear]: {
    wonders: [Wonder.Thistle],
    condition: { criterion: Criterion.GreenCard, count: 3 },
    points: 5,
    bonus: { criterion: Criterion.Chimera, points: 2 }
  },
  [Spirit.Fish]: {
    wonders: [Wonder.Chimera, Wonder.Rock],
    condition: { criterion: Criterion.Clue, count: 4 },
    points: 3
  },
  [Spirit.Fox]: {
    night: 1,
    condition: { criterion: Criterion.GrayCard, count: 3 },
    points: 4,
    bonus: { criterion: Criterion.Clue, points: 2 }
  },
  [Spirit.Frog]: {
    condition: { criterion: Criterion.Thistle, count: 3 },
    bonus: { criterion: Criterion.NoResourceCard, points: 3 }
  },
  [Spirit.Iguana]: {
    condition: { criterion: Criterion.Rock, count: 4 },
    bonus: { criterion: Criterion.NoResourceCard, points: 2 }
  },
  [Spirit.Monkey]: {
    wonders: [Wonder.Rock],
    condition: { criterion: Criterion.YellowCard, count: 3 },
    points: 6,
    bonus: { criterion: Criterion.Thistle, points: 2 }
  },
  [Spirit.Moth]: {
    wonders: [Wonder.Thistle, Wonder.Rock],
    condition: { criterion: Criterion.Night, count: 4 },
    points: 3
  },
  [Spirit.Owl]: {
    clue: 2,
    condition: { criterion: Criterion.ShortExploration, count: 3 },
    bonus: { criterion: Criterion.Spirit, points: 3 }
  },
  [Spirit.Ram]: {
    wonders: [Wonder.Chimera],
    condition: { criterion: Criterion.BlueCard, count: 3 },
    points: 4,
    bonus: { criterion: Criterion.Rock, points: 2 }
  },
  [Spirit.Snake]: {
    condition: { criterion: Criterion.Chimera, count: 3 },
    bonus: { criterion: Criterion.NoResourceCard, points: 2 }
  },
  [Spirit.Turkey]: {
    night: 2,
    condition: { criterion: Criterion.LongExploration, count: 3 },
    bonus: { criterion: Criterion.Spirit, points: 3 }
  }
}
