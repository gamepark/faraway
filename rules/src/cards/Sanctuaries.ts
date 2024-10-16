import { CardDescription } from './CardDescription'
import { Sanctuary } from './Sanctuary'
import { Wonder } from './Wonder'


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
  night: 1
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

const Yellow2: CardDescription = {
  wonders: [Wonder.Rock]
}

const Yellow3: CardDescription = {
  clue: 1
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

const Gray15: CardDescription = {
  clue: 1
}

const Gray16: CardDescription = {
  wonders: [Wonder.Rock]
}

const Gray17: CardDescription = {
  wonders: [Wonder.Chimera]
}

const Gray18: CardDescription = {
  wonders: [Wonder.Rock]
}

const Gray19: CardDescription = {
  clue: 1
}

const Gray20: CardDescription = {
  wonders: [Wonder.Rock]
}

const Gray21: CardDescription = {
  wonders: [Wonder.Chimera]
}

const Gray22: CardDescription = {
  wonders: [Wonder.Thistle]
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

const YellowExp1: CardDescription = {
  night: 1
}

const GrayExp1: CardDescription = {
  wonders: [Wonder.Rock, Wonder.Rock]
}

const GrayExp2: CardDescription = {
  clue: 1
}

const GrayExp3: CardDescription = {
  wonders: [Wonder.Chimera]
}

const GrayExp4: CardDescription = {
  wonders: [Wonder.Thistle]
}

export const Sanctuaries: Partial<Record<Sanctuary, CardDescription>> = {
  [Sanctuary.Red2]: Red2,
  [Sanctuary.Red3]: Red3,
  [Sanctuary.Red4]: Red4,
  [Sanctuary.Red5]: Red5,
  [Sanctuary.Green2]: Green2,
  [Sanctuary.Green3]: Green3,
  [Sanctuary.Green4]: Green4,
  [Sanctuary.Blue2]: Blue2,
  [Sanctuary.Blue3]: Blue3,
  [Sanctuary.Blue4]: Blue4,
  [Sanctuary.Blue5]: Blue5,
  [Sanctuary.Yellow2]: Yellow2,
  [Sanctuary.Yellow3]: Yellow3,
  [Sanctuary.Gray8]: Gray8,
  [Sanctuary.Gray9]: Gray9,
  [Sanctuary.Gray10]: Gray10,
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

  // Expansion
  [Sanctuary.YellowExp1]: YellowExp1,
  [Sanctuary.GrayExp1]: GrayExp1,
  [Sanctuary.GrayExp2]: GrayExp2,
  [Sanctuary.GrayExp3]: GrayExp3,
  [Sanctuary.GrayExp4]: GrayExp4
}