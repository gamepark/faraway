import { CardDescription } from './CardDescription'
import { Color } from './Color'
import { AllColorQuest } from './quests/AllColorQuest'
import { BrutPointQuest } from './quests/BrutPointQuest'
import { ChimeraQuest } from './quests/ChimeraQuest'
import { ClueQuest } from './quests/ClueQuest'
import { ColorQuest } from './quests/ColorQuest'
import { NightQuest } from './quests/NightQuest'
import { RockQuest } from './quests/RockQuest'
import { ThistleQuest } from './quests/ThistleQuest'
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

const Red10: CardDescription = {
  quest: new NightQuest(3)
}

const Red14: CardDescription = {
  wonders: [Wonder.Thistle],
  quest: new NightQuest(2)
}

const Red16: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new ChimeraQuest(2)
}

const Red19: CardDescription = {
  wonders: [Wonder.Thistle],
  quest: new ThistleQuest(2)
}

const Red23: CardDescription = {
  wonders: [Wonder.Chimera, Wonder.Rock],
  quest: new AllColorQuest(10)
}

const Red26: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new ThistleQuest(3)
}

const Red28: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new ChimeraQuest(3)
}

const Red30: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new RockQuest(2)
}

const Red32: CardDescription = {
  wonders: [Wonder.Chimera, Wonder.Rock],
  quest: new BrutPointQuest(7, [Wonder.Rock, Wonder.Rock, Wonder.Rock])
}

const Red36: CardDescription = {
  quest: new ThistleQuest(4, [Wonder.Chimera, Wonder.Chimera])
}

const Red39: CardDescription = {
  wonders: [Wonder.Thistle, Wonder.Rock],
  quest: new BrutPointQuest(9, [Wonder.Chimera, Wonder.Chimera])
}

const Red48: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new RockQuest(3)
}

const Red52: CardDescription = {
  quest: new ChimeraQuest(4, [Wonder.Rock, Wonder.Rock, Wonder.Rock])
}

const Red57: CardDescription = {
  quest: new RockQuest(4, [Wonder.Thistle, Wonder.Thistle, Wonder.Thistle])
}

const Green3: CardDescription = {
  quest: new BrutPointQuest(4)
}

const Green5: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new BrutPointQuest(2)
}

const Green8: CardDescription = {
  clue: 1,
  wonders: [Wonder.Chimera]
}

const Green11: CardDescription = {
  quest: new ClueQuest(2)
}

const Green15: CardDescription = {
  clue: 1,
  quest: new ChimeraQuest(2)
}

const Green18: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new AllColorQuest(10)
}

const Green20: CardDescription = {
  clue: 1,
  quest: new NightQuest(2, [Wonder.Rock])
}

const Green22: CardDescription = {
  clue: 1,
  quest: new ClueQuest(1)
}

const Green34: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new ChimeraQuest(3, [Wonder.Rock, Wonder.Rock])
}

const Green38: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new ClueQuest(3, [Wonder.Chimera, Wonder.Thistle])
}

const Green41: CardDescription = {
  wonders: [Wonder.Thistle],
  quest: new NightQuest(4, [Wonder.Chimera, Wonder.Rock, Wonder.Rock])
}

const Green45: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new BrutPointQuest(13, [Wonder.Chimera, Wonder.Chimera, Wonder.Chimera])
}

const Green54: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new ClueQuest(4, [Wonder.Thistle, Wonder.Thistle])
}

const Green58: CardDescription = {
  clue: 1,
  quest: new ClueQuest(3, [Wonder.Chimera, Wonder.Chimera, Wonder.Chimera])
}

const Green61: CardDescription = {
  wonders: [Wonder.Thistle],
  quest: new BrutPointQuest(17, [Wonder.Chimera, Wonder.Chimera, Wonder.Chimera, Wonder.Chimera])
}


const Green63: CardDescription = {
  clue: 1,
  quest: new BrutPointQuest(15, [Wonder.Chimera, Wonder.Chimera, Wonder.Thistle])
}

const Green67: CardDescription = {
  clue: 1,
  quest: new BrutPointQuest(19, [Wonder.Chimera, Wonder.Chimera, Wonder.Thistle, Wonder.Thistle])
}

const Blue2: CardDescription = {
  wonders: [Wonder.Rock, Wonder.Rock]
}

const Blue6: CardDescription = {
  clue: 1,
  wonders: [Wonder.Rock]
}

const Blue9: CardDescription = {
  quest: new BrutPointQuest(5)
}

const Blue13: CardDescription = {
  quest: new RockQuest(2)
}

const Blue17: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new RockQuest(3, [Wonder.Chimera, Wonder.Chimera])
}

const Blue21: CardDescription = {
  quest: new BrutPointQuest(8, [Wonder.Rock, Wonder.Rock])
}

const Blue24: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new NightQuest(2, [Wonder.Chimera])
}

const Blue40: CardDescription = {
  quest: new NightQuest(3, [Wonder.Thistle, Wonder.Chimera, Wonder.Rock])
}

const Blue43: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new AllColorQuest(10)
}

const Blue46: CardDescription = {
  clue: 1,
  quest: new BrutPointQuest(10, [Wonder.Rock, Wonder.Rock, Wonder.Chimera])
}

const Blue49: CardDescription = {
  clue: 1,
  quest: new BrutPointQuest(12, [Wonder.Rock, Wonder.Rock, Wonder.Thistle])
}

const Blue51: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new BrutPointQuest(14, [Wonder.Rock, Wonder.Rock, Wonder.Rock, Wonder.Rock])
}

const Blue55: CardDescription = {
  clue: 1,
  wonders: [Wonder.Rock],
  quest: new RockQuest(3, [Wonder.Chimera, Wonder.Thistle, Wonder.Thistle])
}

const Blue60: CardDescription = {
  clue: 1,
  quest: new BrutPointQuest(16, [Wonder.Rock, Wonder.Rock, Wonder.Chimera, Wonder.Chimera])
}

const Blue64: CardDescription = {
  clue: 1,
  quest: new BrutPointQuest(18, [Wonder.Rock, Wonder.Rock, Wonder.Thistle, Wonder.Thistle])
}

const Blue66: CardDescription = {
  quest: new BrutPointQuest(20, [Wonder.Rock, Wonder.Rock, Wonder.Rock, Wonder.Rock])
}

const Blue68: CardDescription = {
  quest: new BrutPointQuest(24, [Wonder.Rock, Wonder.Rock, Wonder.Rock, Wonder.Rock, Wonder.Rock])
}

const Yellow12: CardDescription = {
  clue: 1,
  wonders: [Wonder.Thistle]
}

const Yellow25: CardDescription = {
  quest: new ColorQuest(1, [Color.Yellow, Color.Green])
}

const Yellow27: CardDescription = {
  quest: new ColorQuest(1, [Color.Yellow, Color.Blue])
}

const Yellow29: CardDescription = {
  wonders: [Wonder.Thistle],
  quest: new ThistleQuest(2)
}

const Yellow31: CardDescription = {
  quest: new ColorQuest(1, [Color.Yellow, Color.Red])
}

const Yellow33: CardDescription = {
  clue: 1,
  quest: new ThistleQuest(3)
}

const Yellow35: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new AllColorQuest(10)
}

const Yellow37: CardDescription = {
  quest: new NightQuest(3, [Wonder.Thistle])
}

const Yellow42: CardDescription = {
  quest: new ColorQuest(2, [Color.Yellow, Color.Green], [Wonder.Rock, Wonder.Chimera])
}

const Yellow44: CardDescription = {
  quest: new ColorQuest(2, [Color.Yellow, Color.Blue], [Wonder.Rock, Wonder.Thistle])
}

const Yellow47: CardDescription = {
  quest: new ColorQuest(2, [Color.Yellow, Color.Red], [Wonder.Thistle, Wonder.Chimera])
}

const Yellow50: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new ColorQuest(4, [Color.Green], [Wonder.Thistle, Wonder.Thistle])
}

const Yellow53: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new ColorQuest(4, [Color.Red], [Wonder.Thistle, Wonder.Thistle])
}

const Yellow56: CardDescription = {
  wonders: [Wonder.Thistle],
  quest: new ColorQuest(4, [Color.Blue], [Wonder.Chimera, Wonder.Chimera, Wonder.Rock])
}

const Yellow59: CardDescription = {
  clue: 1,
  quest: new ColorQuest(3, [Color.Yellow, Color.Red], [Wonder.Chimera, Wonder.Chimera, Wonder.Chimera, Wonder.Rock  ])
}

const Yellow62: CardDescription = {
  clue: 1,
  quest: new ColorQuest(3, [Color.Yellow, Color.Blue], [Wonder.Thistle, Wonder.Thistle, Wonder.Thistle])
}

const Yellow65: CardDescription = {
  clue: 1,
  quest: new ColorQuest(3, [Color.Yellow, Color.Green], [Wonder.Thistle, Wonder.Thistle, Wonder.Thistle])
}




export const Regions: Partial<Record<Region, CardDescription>> = {
  [Region.Red1]: Red1,
  [Region.Red4]: Red4,
  [Region.Red7]: Red7,
  [Region.Red10]: Red10,
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
  [Region.Red52]: Red52,
  [Region.Red57]: Red57,
  
  [Region.Green3]: Green3,
  [Region.Green5]: Green5,
  [Region.Green8]: Green8,
  [Region.Green11]: Green11,
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
  [Region.Blue9]: Blue9,
  [Region.Blue13]: Blue13,
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
  [Region.Blue66]: Blue66,
  [Region.Blue68]: Blue68,
  [Region.Yellow12]: Yellow12,
  [Region.Yellow25]: Yellow25,
  [Region.Yellow27]: Yellow27,
  [Region.Yellow29]: Yellow29,
  [Region.Yellow31]: Yellow31,
  [Region.Yellow33]: Yellow33,
  [Region.Yellow35]: Yellow35,
  [Region.Yellow37]: Yellow37,
  [Region.Yellow42]: Yellow42,
  [Region.Yellow44]: Yellow44,
  [Region.Yellow47]: Yellow47,
  [Region.Yellow50]: Yellow50,
  [Region.Yellow53]: Yellow53,
  [Region.Yellow56]: Yellow56,
  [Region.Yellow59]: Yellow59,
  [Region.Yellow62]: Yellow62,
  [Region.Yellow65]: Yellow65,


}