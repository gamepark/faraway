import { describe, expect, it } from 'vitest'
import { Region } from '../../../cards/Region'
import { SacrificeHelper } from '../SacrificeHelper'

// Real card → quest mapping in RegionQuests.ts:
//   BlueSky15  → SacrificeQuest(8, 1)
//   RedSky21   → SacrificeQuest(10, 1)
//   YellowSky38→ SacrificeQuest(19, 2)

describe('SacrificeHelper.getEligibleSacrifices', () => {
  it('returns empty when the player holds no SacrificeQuest cards', () => {
    expect(SacrificeHelper.getEligibleSacrifices(
      [{ index: 0, id: Region.Red1 }, { index: 1, id: Region.Green5 }],
      5
    )).toEqual([])
  })

  it('returns empty when the player has zero sanctuaries', () => {
    expect(SacrificeHelper.getEligibleSacrifices(
      [{ index: 3, id: Region.BlueSky15 }],
      0
    )).toEqual([])
  })

  it('returns the option when the player has exactly enough sanctuaries', () => {
    const options = SacrificeHelper.getEligibleSacrifices(
      [{ index: 3, id: Region.BlueSky15 }],
      1
    )
    expect(options).toEqual([
      { regionIndex: 3, regionId: Region.BlueSky15, sanctuariesToSacrifice: 1, points: 8 }
    ])
  })

  it('skips a SacrificeQuest the player cannot pay for, but keeps payable ones', () => {
    // YellowSky38 needs 2 sanctuaries; with only 1, only BlueSky15 (cost 1) is eligible.
    const options = SacrificeHelper.getEligibleSacrifices(
      [
        { index: 0, id: Region.BlueSky15 },
        { index: 2, id: Region.YellowSky38 }
      ],
      1
    )
    expect(options).toEqual([
      { regionIndex: 0, regionId: Region.BlueSky15, sanctuariesToSacrifice: 1, points: 8 }
    ])
  })

  it('returns multiple options when the player can pay for several cards', () => {
    const options = SacrificeHelper.getEligibleSacrifices(
      [
        { index: 0, id: Region.BlueSky15 },
        { index: 1, id: Region.RedSky21 },
        { index: 2, id: Region.YellowSky38 }
      ],
      4
    )
    expect(options).toEqual([
      { regionIndex: 0, regionId: Region.BlueSky15, sanctuariesToSacrifice: 1, points: 8 },
      { regionIndex: 1, regionId: Region.RedSky21, sanctuariesToSacrifice: 1, points: 10 },
      { regionIndex: 2, regionId: Region.YellowSky38, sanctuariesToSacrifice: 2, points: 19 }
    ])
  })
})
