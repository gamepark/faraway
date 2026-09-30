import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { describe, expect, it } from 'vitest'
import { countCriterion } from '../../../cards/CardCounting'
import { Criterion } from '../../../cards/Criterion'
import { Region } from '../../../cards/Region'
import { Sanctuary } from '../../../cards/Sanctuary'
import { Spirit } from '../../../cards/Spirit'
import { FarawayRules } from '../../../FarawayRules'
import { FarawaySetup } from '../../../FarawaySetup'
import { LocationType } from '../../../material/LocationType'
import { MaterialType } from '../../../material/MaterialType'
import { Memory } from '../../Memory'
import { getRegionCardScore, ScoreHelper } from '../ScoreHelper'
import { getSpiritQuestScore, SpiritHelper } from '../SpiritHelper'

const region = (id: Region, x = 0) => ({ id, location: { type: LocationType.PlayerRegionLine, player: 1, x, rotation: true } }) as any
const sanctuary = (id: Sanctuary) => ({ id, location: { type: LocationType.PlayerSanctuaryLine, player: 1 } }) as any
const spirit = (id: Spirit, x: number, parent: number) => ({ id, location: { type: LocationType.PlayerSpirit, player: 1, x, parent } }) as any

describe('Beyond the Veil criteria', () => {
  it('counts cards without resources, a Spirit and its Region being one card', () => {
    // Red10: no wonder, Red14: thistle, Green3?: see Regions
    const regions = [region(Region.Red36, 0), region(Region.Red10, 1), region(Region.Red14, 2)]
    const sanctuaries = [sanctuary(Sanctuary.Red1)]
    expect(countCriterion(Criterion.NoResourceCard, { regions, sanctuaries })).toBe(3)
    // Bat spirit has only a clue: still no resources
    expect(countCriterion(Criterion.NoResourceCard, { regions, sanctuaries, spirits: [spirit(Spirit.Bat, 0, 0)] })).toBe(3)
    // Bear spirit has a thistle: Red36 + Bear now has a resource
    expect(countCriterion(Criterion.NoResourceCard, { regions, sanctuaries, spirits: [spirit(Spirit.Bear, 0, 0)] })).toBe(2)
  })

  it('counts exploration durations', () => {
    const regions = [region(Region.Red1), region(Region.Red19), region(Region.Blue21), region(Region.Green41), region(Region.Red57)]
    expect(countCriterion(Criterion.ShortExploration, { regions, sanctuaries: [] })).toBe(2)
    expect(countCriterion(Criterion.LongExploration, { regions, sanctuaries: [] })).toBe(2)
  })

  it('never counts Spirits as colored cards', () => {
    const regions = [region(Region.Red1)]
    expect(countCriterion(Criterion.RedCard, { regions, sanctuaries: [sanctuary(Sanctuary.Red2)], spirits: [spirit(Spirit.Bat, 0, 0)] })).toBe(2)
  })
})

const game = (regions: any[], spirits: any[], memory: Record<number, unknown> = {}): MaterialGame => ({
  players: [1, 2],
  items: {
    [MaterialType.Region]: regions,
    [MaterialType.Sanctuary]: [],
    [MaterialType.Spirit]: spirits
  },
  memory
} as any)

describe('Spirit acquisition', () => {
  const redRegions = [region(Region.Red1, 0), region(Region.Red4, 1), region(Region.Red7, 2)]
  const available = (id: Spirit) => ({ id, location: { type: LocationType.AvailableSpirit, x: 0 } })

  it('requires the conditions', () => {
    expect(new SpiritHelper(game(redRegions.slice(0, 2), [available(Spirit.Bat)], { [Memory.Round]: 2 })).canTake(0, 1)).toBe(false)
    expect(new SpiritHelper(game(redRegions, [available(Spirit.Bat)], { [Memory.Round]: 3 })).canTake(0, 1)).toBe(true)
  })

  it('requires a card part of the conditions played this turn', () => {
    const round = (n: number) => ({ [Memory.Round]: n })
    // Round 3: Red7 played this turn
    expect(new SpiritHelper(game(redRegions, [available(Spirit.Bat)], round(3))).canTake(0, 1)).toBe(true)
    // Round 4: a blue card played this turn, the conditions were already satisfied
    const withBlue = [...redRegions, region(Region.Blue2, 3)]
    expect(new SpiritHelper(game(withBlue, [available(Spirit.Bat)], round(4))).canTake(0, 1)).toBe(false)
    expect(new SpiritHelper(game(withBlue, [available(Spirit.Bat)], round(4))).isBlocked(0, 1)).toBe(true)
    // Round 4 with a red Sanctuary placed this turn (Blue46 > Red7)
    const higher = [...redRegions, region(Region.Blue46, 3)]
    const g = game(higher, [available(Spirit.Bat)], round(4))
    g.items[MaterialType.Sanctuary] = [{ ...sanctuary(Sanctuary.Red2), location: { type: LocationType.PlayerSanctuaryLine, player: 1, x: 0 } }]
    expect(new SpiritHelper(g).canTake(0, 1)).toBe(true)
  })

  it('counts the resources of the Spirits already taken', () => {
    // Iguana requires 4 rocks: Red1, Red4 have 1 rock each, Fish (under Red1) and Monkey (under Red4) bring 2 more
    const regions = [region(Region.Red1, 0), region(Region.Red4, 1)]
    const taken = [spirit(Spirit.Fish, 0, 0), spirit(Spirit.Monkey, 1, 1)]
    expect(new SpiritHelper(game(regions, [available(Spirit.Iguana)], { [Memory.Round]: 2 })).canTake(0, 1)).toBe(false)
    expect(new SpiritHelper(game(regions, [available(Spirit.Iguana), ...taken], { [Memory.Round]: 2 })).canTake(0, 1)).toBe(true)
  })

  it('does not count a Region without resources once it has a Spirit with resources', () => {
    // Axolotl requires 4 cards without resources
    const regions = [region(Region.Red10, 0), region(Region.Red36, 1), region(Region.Red52, 2), region(Region.RedExp69, 3)]
    expect(new SpiritHelper(game(regions, [available(Spirit.Axolotl)], { [Memory.Round]: 4 })).canTake(0, 1)).toBe(true)
    expect(new SpiritHelper(game(regions, [available(Spirit.Axolotl), spirit(Spirit.Bear, 0, 0)], { [Memory.Round]: 4 })).canTake(0, 1)).toBe(false)
  })
})

describe('Spirit scoring', () => {
  it('scores points plus bonus for the cards visible with its Region', () => {
    // Bear: 5 + 2 per chimera. Red1 (chimera, rock) at x=0 is not visible yet when the card at x=1 is scored.
    const regions = [region(Region.Red1, 0), region(Region.Red16, 1)]
    const spirits = [spirit(Spirit.Bear, 1, 1)]
    expect(getSpiritQuestScore(game(regions, spirits), 0)).toBe(7)
    const bothVisible = [region(Region.Red1, 1), region(Region.Red16, 0)]
    expect(getSpiritQuestScore(game(bothVisible, [spirit(Spirit.Bear, 0, 1)]), 0)).toBe(9)
  })

  it('counts visible Spirits for Owl and Turkey', () => {
    const regions = [region(Region.Red1, 0), region(Region.Red4, 1)]
    const spirits = [spirit(Spirit.Owl, 0, 0), spirit(Spirit.Turkey, 1, 1)]
    expect(getSpiritQuestScore(game(regions, spirits), 0)).toBe(6)
    expect(getSpiritQuestScore(game(regions, spirits), 1)).toBe(3)
  })

  it('adds Spirit resources to Region quests', () => {
    // Red16: 2 points per chimera. Red16 has a chimera, Ram spirit has a chimera.
    const regions = [region(Region.Red16, 0)]
    expect(getRegionCardScore(game(regions, []), 0)).toBe(2)
    expect(getRegionCardScore(game(regions, [spirit(Spirit.Ram, 0, 0)]), 0)).toBe(4)
  })
})

describe('Beyond the Veil full games', () => {
  const playWithConsequences = (rules: FarawayRules, move: MaterialMove) => {
    const queue = [move]
    while (queue.length) {
      const next = rules.randomize(queue.shift()!)
      queue.unshift(...rules.play(next))
    }
  }

  for (const players of [2, 4, 6]) {
    it(`plays random games to the end with ${players} players`, () => {
      for (let n = 0; n < 5; n++) {
        const setup = new FarawaySetup()
        const g = setup.setup({ players, beginner: false, expansion1: players > 4, starrySkies: n % 2 === 0, beyondTheVeil: true })
        const rules = new FarawayRules(g)
        let guard = 0
        while (!rules.isOver() && guard++ < 5000) {
          const player = g.players.find(p => rules.isTurnToPlay(p))!
          const moves = rules.getLegalMoves(player)
          expect(moves.length).toBeGreaterThan(0)
          playWithConsequences(rules, moves[Math.floor(Math.random() * moves.length)])
        }
        expect(rules.isOver()).toBe(true)
        const spirits = rules.material(MaterialType.Spirit)
        expect(spirits.length).toBe(13)
        for (const item of spirits.location(LocationType.PlayerSpirit).getItems()) {
          const parent = rules.material(MaterialType.Region).getItem(item.location.parent!)
          expect(parent.location.player).toBe(item.location.player)
          expect(parent.location.x).toBe(item.location.x)
        }
        for (const player of g.players) {
          expect(new ScoreHelper(g, player).score).toBeGreaterThanOrEqual(0)
        }
      }
    })
  }
})
