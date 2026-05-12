import { describe, expect, it } from 'vitest'
import { LocationType } from '../../../material/LocationType'
import { MaterialType } from '../../../material/MaterialType'
import { Memory } from '../../../rules/Memory'
import { Region } from '../../Region'
import { SacrificeQuest } from '../SacrificeQuest'

// Build a minimal MaterialGame whose region material has a single card at a given x,
// and whose memory holds the SacrificesByX map written by SacrificeSanctuaryRule.
const game = (
  cardLocation: { player: number; x: number },
  sacrifices: Record<number, Record<number, number>> = {}
) => ({
  players: [1, 2],
  items: {
    [MaterialType.Region]: [
      { id: Region.BlueSky15, location: { type: LocationType.PlayerRegionLine, ...cardLocation } }
    ],
    [MaterialType.Sanctuary]: []
  } as any,
  memory: { [Memory.SacrificesByX]: sacrifices }
} as any)

describe('SacrificeQuest.getTotalScore (activation via SacrificesByX memory)', () => {
  const quest1 = new SacrificeQuest(8, 1)
  const quest2 = new SacrificeQuest(19, 2)
  const playerId = 1
  const cardIndex = 0

  it('returns 0 when no sacrifices were recorded', () => {
    const g = game({ player: playerId, x: 5 })
    expect(quest1.getTotalScore(g, cardIndex, MaterialType.Region, playerId)).toBe(0)
  })

  it('returns the points when this player sacrificed enough at the card\'s x', () => {
    const g = game({ player: playerId, x: 5 }, { 5: { [playerId]: 1 } })
    expect(quest1.getTotalScore(g, cardIndex, MaterialType.Region, playerId)).toBe(8)
  })

  it('returns 0 when sacrifices were recorded at a different x', () => {
    // Sacrifice happened at x=3, but the card sits at x=5. Different tick → no credit.
    const g = game({ player: playerId, x: 5 }, { 3: { [playerId]: 1 } })
    expect(quest1.getTotalScore(g, cardIndex, MaterialType.Region, playerId)).toBe(0)
  })

  it('isolates by player — another player\'s sacrifices do not score for us', () => {
    const g = game({ player: playerId, x: 5 }, { 5: { 2: 1 } })
    expect(quest1.getTotalScore(g, cardIndex, MaterialType.Region, playerId)).toBe(0)
  })

  it('scores only when the cost is fully paid (cost 2, paid 1 → 0)', () => {
    const g = game({ player: playerId, x: 5 }, { 5: { [playerId]: 1 } })
    expect(quest2.getTotalScore(g, cardIndex, MaterialType.Region, playerId)).toBe(0)
  })

  it('scores when the cost is fully paid (cost 2, paid 2 → 19)', () => {
    const g = game({ player: playerId, x: 5 }, { 5: { [playerId]: 2 } })
    expect(quest2.getTotalScore(g, cardIndex, MaterialType.Region, playerId)).toBe(19)
  })
})
