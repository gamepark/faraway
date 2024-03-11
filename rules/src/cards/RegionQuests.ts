import { Color } from './Color'
import { AllColorQuest } from './quests/AllColorQuest'
import { BrutPointQuest } from './quests/BrutPointQuest'
import { ChimeraQuest } from './quests/ChimeraQuest'
import { ClueQuest } from './quests/ClueQuest'
import { ColorQuest } from './quests/ColorQuest'
import { NightQuest } from './quests/NightQuest'
import { Quest } from './quests/Quest'
import { RockQuest } from './quests/RockQuest'
import { ThistleQuest } from './quests/ThistleQuest'
import { Region } from './Region'
import { Wonder } from './Wonder'

export const RegionQuests: Partial<Record<Region, Quest>> = {

  [Region.Red10]: new NightQuest(3),
  [Region.Red14]: new NightQuest(2),
  [Region.Red16]: new ChimeraQuest(2),
  [Region.Red19]: new ThistleQuest(2),
  [Region.Red23]: new AllColorQuest(10),
  [Region.Red26]: new ThistleQuest(3),
  [Region.Red28]: new ChimeraQuest(3),
  [Region.Red30]: new RockQuest(2),
  [Region.Red32]: new BrutPointQuest(7, [Wonder.Rock, Wonder.Rock, Wonder.Rock]),
  [Region.Red36]: new ThistleQuest(4, [Wonder.Chimera, Wonder.Chimera]),
  [Region.Red39]: new BrutPointQuest(9, [Wonder.Chimera, Wonder.Chimera]),
  [Region.Red48]: new RockQuest(3),
  [Region.Red52]: new ChimeraQuest(4, [Wonder.Rock, Wonder.Rock, Wonder.Rock]),
  [Region.Red57]: new RockQuest(4, [Wonder.Thistle, Wonder.Thistle, Wonder.Thistle]),
  [Region.Green3]: new BrutPointQuest(4),
  [Region.Green5]: new BrutPointQuest(2),
  [Region.Green11]: new ClueQuest(2),
  [Region.Green15]: new ChimeraQuest(2),
  [Region.Green18]: new AllColorQuest(10),
  [Region.Green20]: new NightQuest(2, [Wonder.Rock]),
  [Region.Green22]: new ClueQuest(1),
  [Region.Green34]: new ChimeraQuest(3, [Wonder.Rock, Wonder.Rock]),
  [Region.Green38]: new ClueQuest(3, [Wonder.Chimera, Wonder.Thistle]),
  [Region.Green41]: new NightQuest(4, [Wonder.Chimera, Wonder.Rock, Wonder.Rock]),
  [Region.Green45]: new BrutPointQuest(13, [Wonder.Chimera, Wonder.Chimera, Wonder.Chimera]),
  [Region.Green54]: new ClueQuest(4, [Wonder.Thistle, Wonder.Thistle]),
  [Region.Green58]: new ClueQuest(3, [Wonder.Chimera, Wonder.Chimera, Wonder.Chimera]),
  [Region.Green61]: new BrutPointQuest(17, [Wonder.Chimera, Wonder.Chimera, Wonder.Chimera, Wonder.Chimera]),
  [Region.Green63]: new BrutPointQuest(15, [Wonder.Chimera, Wonder.Chimera, Wonder.Thistle]),
  [Region.Green67]: new BrutPointQuest(19, [Wonder.Chimera, Wonder.Chimera, Wonder.Thistle, Wonder.Thistle]),
  [Region.Blue9]: new BrutPointQuest(5),
  [Region.Blue13]: new RockQuest(2),
  [Region.Blue17]: new RockQuest(3, [Wonder.Chimera, Wonder.Chimera]),
  [Region.Blue21]: new BrutPointQuest(8, [Wonder.Rock, Wonder.Rock]),
  [Region.Blue24]: new NightQuest(2, [Wonder.Chimera]),
  [Region.Blue40]: new NightQuest(3, [Wonder.Thistle, Wonder.Chimera, Wonder.Rock]),
  [Region.Blue43]: new AllColorQuest(10),
  [Region.Blue46]: new BrutPointQuest(10, [Wonder.Rock, Wonder.Rock, Wonder.Chimera]),
  [Region.Blue49]: new BrutPointQuest(12, [Wonder.Rock, Wonder.Rock, Wonder.Thistle]),
  [Region.Blue51]: new BrutPointQuest(14, [Wonder.Rock, Wonder.Rock, Wonder.Rock, Wonder.Rock]),
  [Region.Blue55]: new RockQuest(3, [Wonder.Chimera, Wonder.Thistle, Wonder.Thistle]),
  [Region.Blue60]: new BrutPointQuest(16, [Wonder.Rock, Wonder.Rock, Wonder.Chimera, Wonder.Chimera]),
  [Region.Blue64]: new BrutPointQuest(18, [Wonder.Rock, Wonder.Rock, Wonder.Thistle, Wonder.Thistle]),
  [Region.Blue66]: new BrutPointQuest(20, [Wonder.Rock, Wonder.Rock, Wonder.Rock, Wonder.Rock]),
  [Region.Blue68]: new BrutPointQuest(24, [Wonder.Rock, Wonder.Rock, Wonder.Rock, Wonder.Rock, Wonder.Rock]),
  [Region.Yellow25]: new ColorQuest(1, [Color.Yellow, Color.Green]),
  [Region.Yellow27]: new ColorQuest(1, [Color.Yellow, Color.Blue]),
  [Region.Yellow29]: new ThistleQuest(2),
  [Region.Yellow31]: new ColorQuest(1, [Color.Yellow, Color.Red]),
  [Region.Yellow33]: new ThistleQuest(3),
  [Region.Yellow35]: new AllColorQuest(10),
  [Region.Yellow37]: new NightQuest(3, [Wonder.Thistle]),
  [Region.Yellow42]: new ColorQuest(2, [Color.Yellow, Color.Green], [Wonder.Rock, Wonder.Chimera]),
  [Region.Yellow44]: new ColorQuest(2, [Color.Yellow, Color.Blue], [Wonder.Rock, Wonder.Thistle]),
  [Region.Yellow47]: new ColorQuest(2, [Color.Yellow, Color.Red], [Wonder.Thistle, Wonder.Chimera]),
  [Region.Yellow50]: new ColorQuest(4, [Color.Green], [Wonder.Thistle, Wonder.Thistle]),
  [Region.Yellow53]: new ColorQuest(4, [Color.Red], [Wonder.Thistle, Wonder.Thistle]),
  [Region.Yellow56]: new ColorQuest(4, [Color.Blue], [Wonder.Chimera, Wonder.Chimera, Wonder.Rock]),
  [Region.Yellow59]: new ColorQuest(3, [Color.Yellow, Color.Red], [Wonder.Chimera, Wonder.Chimera, Wonder.Chimera, Wonder.Rock]),
  [Region.Yellow62]: new ColorQuest(3, [Color.Yellow, Color.Blue], [Wonder.Thistle, Wonder.Thistle, Wonder.Thistle]),
  [Region.Yellow65]: new ColorQuest(3, [Color.Yellow, Color.Green], [Wonder.Thistle, Wonder.Thistle, Wonder.Thistle])

}

