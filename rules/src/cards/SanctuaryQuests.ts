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
import { Sanctuary } from './Sanctuary'

export const SanctuaryQuests: Partial<Record<Sanctuary, Quest>> = {
  [Sanctuary.Red1]: new ColorQuest(1, [Color.Red]),
  [Sanctuary.Red1]: new ColorQuest(1, [Color.Red]),
  [Sanctuary.Green1]: new ColorQuest(1, [Color.Green]),
  [Sanctuary.Green5]: new NightQuest(1),
  [Sanctuary.Blue1]: new ColorQuest(1, [Color.Blue]),
  [Sanctuary.Yellow1]: new ColorQuest(1, [Color.Yellow]),
  [Sanctuary.Yellow4]: new AllColorQuest(4),
  [Sanctuary.Yellow5]: new ClueQuest(1),
  [Sanctuary.Gray1]: new ColorQuest(1, [Color.Blue, Color.Yellow]),
  [Sanctuary.Gray2]: new ColorQuest(1, [Color.Green, Color.Red]),
  [Sanctuary.Gray3]: new ColorQuest(1, [Color.Red, Color.Yellow]),
  [Sanctuary.Gray4]: new ColorQuest(1, [Color.Yellow, Color.Gray]),
  [Sanctuary.Gray5]: new ColorQuest(1, [Color.Gray, Color.Blue]),
  [Sanctuary.Gray6]: new ColorQuest(1, [Color.Red, Color.Blue]),
  [Sanctuary.Gray7]: new BrutPointQuest(5),
  [Sanctuary.Gray11]: new ThistleQuest(2),
  [Sanctuary.Gray12]: new RockQuest(2),
  [Sanctuary.Gray13]: new ChimeraQuest(2),
  [Sanctuary.Gray14]: new ClueQuest(2),
  [Sanctuary.Gray15]: new AllColorQuest(4),
  [Sanctuary.Gray16]: new NightQuest(1),
  [Sanctuary.Gray17]: new ClueQuest(1),
  [Sanctuary.Gray18]: new ClueQuest(1),
  [Sanctuary.Gray19]: new ClueQuest(1),
  [Sanctuary.Gray20]: new RockQuest(1),
  [Sanctuary.Gray21]: new ChimeraQuest(1),
  [Sanctuary.Gray22]: new ThistleQuest(1),
}