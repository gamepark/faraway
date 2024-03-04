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
import { Sanctuary } from './Sanctuary'
import { Wonder } from './Wonder'

const Red1: CardDescription = {
  quest: new ColorQuest(1, [Color.Red])
}

const Red2: CardDescription = {
  wonders: [Wonder.Chimera]
}

const Red3: CardDescription = {
  wonders: [Wonder.Rock]
}

const Red4: CardDescription = {
  wonders: [Wonder.Thistle]
}

const Red5: CardDescription = {
  night: 1,
}

const Green1: CardDescription = {
  quest: new ColorQuest(1, [Color.Green])
}

const Green2: CardDescription = {
  wonders: [Wonder.Chimera]

}

const Green3: CardDescription = {
  wonders: [Wonder.Rock]

}

const Green4: CardDescription = {
  clue: 1
}

const Green5: CardDescription = {
  quest: new NightQuest(1)
}

const Blue1: CardDescription = {
  quest: new ColorQuest(1, [Color.Blue])
}

const Blue2: CardDescription = {
  wonders: [Wonder.Chimera]
}

const Blue3: CardDescription = {
  wonders: [Wonder.Rock]
}

const Blue4: CardDescription = {
  wonders: [Wonder.Thistle]
}

const Blue5: CardDescription = {
  clue: 1
}

const Yellow1: CardDescription = {
  quest: new ColorQuest(1, [Color.Yellow])
}

const Yellow2: CardDescription = {
  wonders: [Wonder.Rock]
}

const Yellow3: CardDescription = {
  clue: 1
}

const Yellow4: CardDescription = {
  quest: new AllColorQuest(4)
}

const Yellow5: CardDescription = {
  quest: new ClueQuest(1)
}

const Gray1: CardDescription = {
  quest: new ColorQuest(1, [Color.Blue, Color.Yellow])
}

const Gray2: CardDescription = {
  quest: new ColorQuest(1, [Color.Green, Color.Red])
}

const Gray3: CardDescription = {
  quest: new ColorQuest(1, [Color.Red, Color.Yellow])
}

const Gray4: CardDescription = {
  quest: new ColorQuest(1, [Color.Yellow, Color.Gray])
}

const Gray5: CardDescription = {
  quest: new ColorQuest(1, [Color.Gray, Color.Blue])
}

const Gray6: CardDescription = {
  quest: new ColorQuest(1, [Color.Red, Color.Blue])
}

const Gray7: CardDescription = {
  quest: new BrutPointQuest(5)
}

const Gray8: CardDescription = {
  clue: 1,
  wonders: [Wonder.Rock]
}

const Gray9: CardDescription = {
  clue: 1,
  wonders: [Wonder.Chimera]
}

const Gray10: CardDescription = {
  clue: 1,
  wonders: [Wonder.Thistle]
}

const Gray11: CardDescription = {
  quest: new ThistleQuest(2)
}

const Gray12: CardDescription = {
  quest: new RockQuest(2)
}

const Gray13: CardDescription = {
  quest: new ChimeraQuest(2)
}

const Gray14: CardDescription = {
  quest: new ClueQuest(2)
}

const Gray15: CardDescription = {
  clue: 1,
  quest: new AllColorQuest(4)
}

const Gray16: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new NightQuest(1)
}

const Gray17: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new ClueQuest(1)
}

const Gray18: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new ClueQuest(1)
}

const Gray19: CardDescription = {
  clue: 1,
  quest: new ClueQuest(1)
}

const Gray20: CardDescription = {
  wonders: [Wonder.Rock],
  quest: new RockQuest(1)
}

const Gray21: CardDescription = {
  wonders: [Wonder.Chimera],
  quest: new ChimeraQuest(1)
}

const Gray22: CardDescription = {
  wonders: [Wonder.Thistle],
  quest: new ThistleQuest(1)
}

const Gray23: CardDescription = {
  night: 1,
  wonders: [Wonder.Rock]
}

const Gray24: CardDescription = {
  night: 1,
  wonders: [Wonder.Chimera]
}

const Gray25: CardDescription = {
  night: 1,
  wonders: [Wonder.Thistle]
}

export const Sanctuaries: Record<Sanctuary, CardDescription> = {
  [Sanctuary.Red1]: Red1,
  [Sanctuary.Red2]: Red2,
  [Sanctuary.Red3]: Red3,
  [Sanctuary.Red4]: Red4,
  [Sanctuary.Red5]: Red5,
  [Sanctuary.Green1]: Green1,
  [Sanctuary.Green2]: Green2,
  [Sanctuary.Green3]: Green3,
  [Sanctuary.Green4]: Green4,
  [Sanctuary.Green5]: Green5,
  [Sanctuary.Blue1]: Blue1,
  [Sanctuary.Blue2]: Blue2,
  [Sanctuary.Blue3]: Blue3,
  [Sanctuary.Blue4]: Blue4,
  [Sanctuary.Blue5]: Blue5,
  [Sanctuary.Yellow1]: Yellow1,
  [Sanctuary.Yellow2]: Yellow2,
  [Sanctuary.Yellow3]: Yellow3,
  [Sanctuary.Yellow4]: Yellow4,
  [Sanctuary.Yellow5]: Yellow5,
  [Sanctuary.Gray1]: Gray1,
  [Sanctuary.Gray2]: Gray2,
  [Sanctuary.Gray3]: Gray3,
  [Sanctuary.Gray4]: Gray4,
  [Sanctuary.Gray5]: Gray5,
  [Sanctuary.Gray6]: Gray6,
  [Sanctuary.Gray7]: Gray7,
  [Sanctuary.Gray8]: Gray8,
  [Sanctuary.Gray9]: Gray9,
  [Sanctuary.Gray10]: Gray10,
  [Sanctuary.Gray11]: Gray11,
  [Sanctuary.Gray12]: Gray12,
  [Sanctuary.Gray13]: Gray13,
  [Sanctuary.Gray14]: Gray14,
  [Sanctuary.Gray15]: Gray15,
  [Sanctuary.Gray16]: Gray16,
  [Sanctuary.Gray17]: Gray17,
  [Sanctuary.Gray18]: Gray18,
  [Sanctuary.Gray19]: Gray19,
  [Sanctuary.Gray20]: Gray20,
  [Sanctuary.Gray21]: Gray21,
  [Sanctuary.Gray22]: Gray22,
  [Sanctuary.Gray23]: Gray23,
  [Sanctuary.Gray24]: Gray24,
  [Sanctuary.Gray25]: Gray25,
}