import { CardDescription } from './CardDescription'
import { Region } from './Region'
import { Wonder } from './Wonder'


const Red1: CardDescription = {
  wonders: [Wonder.Chimera, Wonder.Rock]
}

const Red4: CardDescription = {
  wonders: [Wonder.Thistle, Wonder.Rock]
}

const Red7: CardDescription = {
  wonders: [Wonder.Chimera, Wonder.Thistle]
}

const Red14: CardDescription = {
  wonders: [Wonder.Thistle],
}

const Red16: CardDescription = {
  wonders: [Wonder.Chimera],
}

const Red19: CardDescription = {
  wonders: [Wonder.Thistle],
}

const Red23: CardDescription = {
  night: 1,
  wonders: [Wonder.Chimera, Wonder.Rock],
}

const Red26: CardDescription = {
  night: 1,
  wonders: [Wonder.Chimera],
}

const Red28: CardDescription = {
  night: 1,
  wonders: [Wonder.Rock],
}

const Red30: CardDescription = {
  night: 1,
  wonders: [Wonder.Rock],
}

const Red32: CardDescription = {
  night: 1,
  wonders: [Wonder.Chimera, Wonder.Rock],
}

const Red36: CardDescription = {
  night: 1,
}

const Red39: CardDescription = {
  night: 1,
  wonders: [Wonder.Thistle, Wonder.Rock],
}

const Red48: CardDescription = {
  wonders: [Wonder.Chimera],
}


const Green5: CardDescription = {
  wonders: [Wonder.Chimera],
}

const Green8: CardDescription = {
  clue: 1,
  wonders: [Wonder.Chimera]
}

const Green15: CardDescription = {
  clue: 1,
}

const Green18: CardDescription = {
  wonders: [Wonder.Chimera],
}

const Green20: CardDescription = {
  night: 1,
  clue: 1,
}

const Green22: CardDescription = {
  night: 1,
  clue: 1,
}

const Green34: CardDescription = {
  night: 1,
  wonders: [Wonder.Chimera],
}

const Green38: CardDescription = {
  night: 1,
  wonders: [Wonder.Rock],
}

const Green41: CardDescription = {
  wonders: [Wonder.Thistle],
}

const Green45: CardDescription = {
  wonders: [Wonder.Rock],
}

const Green54: CardDescription = {
  wonders: [Wonder.Chimera],
}

const Green58: CardDescription = {
  clue: 1,
}

const Green61: CardDescription = {
  wonders: [Wonder.Thistle],
}


const Green63: CardDescription = {
  clue: 1,
}

const Green67: CardDescription = {
  clue: 1,
}

const Blue2: CardDescription = {
  wonders: [Wonder.Rock, Wonder.Rock]
}

const Blue6: CardDescription = {
  clue: 1,
  wonders: [Wonder.Rock]
}

const Blue17: CardDescription = {
  wonders: [Wonder.Rock],
}

const Blue21: CardDescription = {
  night: 1,
}

const Blue24: CardDescription = {
  night: 1,
  wonders: [Wonder.Rock],
}

const Blue40: CardDescription = {
  night: 1,
}

const Blue43: CardDescription = {
  wonders: [Wonder.Rock],
}

const Blue46: CardDescription = {
  clue: 1,
}

const Blue49: CardDescription = {
  clue: 1,
}

const Blue51: CardDescription = {
  wonders: [Wonder.Rock],
}

const Blue55: CardDescription = {
  clue: 1,
  wonders: [Wonder.Rock],
}

const Blue60: CardDescription = {
  clue: 1,
}

const Blue64: CardDescription = {
  clue: 1,
}

const Yellow12: CardDescription = {
  clue: 1,
  wonders: [Wonder.Thistle]
}

const Yellow25: CardDescription = {
  night: 1,
}

const Yellow27: CardDescription = {
  night: 1,
}

const Yellow29: CardDescription = {
  night: 1,
  wonders: [Wonder.Thistle],
}

const Yellow31: CardDescription = {
  night: 1,
}

const Yellow33: CardDescription = {
  night: 1,
  clue: 1,
}

const Yellow35: CardDescription = {
  night: 1,
  wonders: [Wonder.Chimera],
}

const Yellow37: CardDescription = {
  night: 1,
}

const Yellow50: CardDescription = {
  wonders: [Wonder.Rock],
}

const Yellow53: CardDescription = {
  wonders: [Wonder.Chimera],
}

const Yellow56: CardDescription = {
  wonders: [Wonder.Thistle],
}

const Yellow59: CardDescription = {
  clue: 1,
}

const Yellow62: CardDescription = {
  clue: 1,
}

const Yellow65: CardDescription = {
  clue: 1,
}


export const Regions: Partial<Record<Region, CardDescription>> = {
  [Region.Red1]: Red1,
  [Region.Red4]: Red4,
  [Region.Red7]: Red7,
  [Region.Red14]: Red14,
  [Region.Red16]: Red16,
  [Region.Red19]: Red19,
  [Region.Red23]: Red23,
  [Region.Red26]: Red26,
  [Region.Red28]: Red28,
  [Region.Red30]: Red30,
  [Region.Red32]: Red32,
  [Region.Red36]: Red36,
  [Region.Red39]: Red39,
  [Region.Red48]: Red48,
  [Region.Green5]: Green5,
  [Region.Green8]: Green8,
  [Region.Green15]: Green15,
  [Region.Green18]: Green18,
  [Region.Green20]: Green20,
  [Region.Green22]: Green22,
  [Region.Green34]: Green34,
  [Region.Green38]: Green38,
  [Region.Green41]: Green41,
  [Region.Green45]: Green45,
  [Region.Green54]: Green54,
  [Region.Green58]: Green58,
  [Region.Green61]: Green61,
  [Region.Green63]: Green63,
  [Region.Green67]: Green67,

  [Region.Blue2]: Blue2,
  [Region.Blue6]: Blue6,
  [Region.Blue17]: Blue17,
  [Region.Blue21]: Blue21,
  [Region.Blue24]: Blue24,
  [Region.Blue40]: Blue40,
  [Region.Blue43]: Blue43,
  [Region.Blue46]: Blue46,
  [Region.Blue49]: Blue49,
  [Region.Blue51]: Blue51,
  [Region.Blue55]: Blue55,
  [Region.Blue60]: Blue60,
  [Region.Blue64]: Blue64,
  [Region.Yellow12]: Yellow12,
  [Region.Yellow25]: Yellow25,
  [Region.Yellow27]: Yellow27,
  [Region.Yellow29]: Yellow29,
  [Region.Yellow31]: Yellow31,
  [Region.Yellow33]: Yellow33,
  [Region.Yellow35]: Yellow35,
  [Region.Yellow37]: Yellow37,
  [Region.Yellow50]: Yellow50,
  [Region.Yellow53]: Yellow53,
  [Region.Yellow56]: Yellow56,
  [Region.Yellow59]: Yellow59,
  [Region.Yellow62]: Yellow62,
  [Region.Yellow65]: Yellow65,


}