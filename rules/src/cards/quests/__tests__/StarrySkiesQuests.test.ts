import { describe, expect, it } from 'vitest'
import { Color } from '../../Color'
import { compareTime, isStarrySkies, Region, stayedVisible } from '../../Region'
import { Sanctuary } from '../../Sanctuary'
import { Wonder } from '../../Wonder'
import { MultiWonderSumQuest } from '../MultiWonderSumQuest'
import { RequireClueQuest } from '../RequireClueQuest'
import { RequireColorQuest } from '../RequireColorQuest'
import { RequireNightQuest } from '../RequireNightQuest'
import { SacrificeQuest } from '../SacrificeQuest'

// MaterialItem stand-ins — the new quests only read `.id` off these items.
const region = (id: Region) => ({ id }) as any
const sanctuary = (id: Sanctuary) => ({ id }) as any

describe('SacrificeQuest', () => {
  it('does not score when the player has fewer sanctuaries than required', () => {
    const quest = new SacrificeQuest(8, 1)
    expect(quest.getScore([], [])).toBeUndefined()
  })

  it('scores the full points when sanctuary count meets the requirement', () => {
    const quest = new SacrificeQuest(8, 1)
    expect(quest.getScore([], [sanctuary(Sanctuary.Red5)])).toBe(8)
  })

  it('also scores when sanctuary count exceeds the requirement', () => {
    const quest = new SacrificeQuest(19, 2)
    const sancs = [sanctuary(Sanctuary.Red5), sanctuary(Sanctuary.Green4), sanctuary(Sanctuary.Blue2)]
    expect(quest.getScore([], sancs)).toBe(19)
  })

  it('rejects exactly one sanctuary when two are required', () => {
    const quest = new SacrificeQuest(19, 2)
    expect(quest.getScore([], [sanctuary(Sanctuary.Red5)])).toBeUndefined()
  })
})

// Sanctuary-discard scoring step — the SacrificeQuest cards from Starry Skies
// allow the player to discard N sanctuaries to score X points. The current
// implementation auto-scores once the threshold is met (the actual discard
// flow is the Phase 5 TODO in SacrificeQuest.ts). These tests pin the
// threshold behavior across the three real cards and a few edge cases.
describe('Sanctuary-discard scoring (SacrificeQuest cards)', () => {
  // Real cards in the extension:
  //   BlueSky15  → SacrificeQuest(8, 1)
  //   RedSky21   → SacrificeQuest(10, 1)
  //   YellowSky38→ SacrificeQuest(19, 2)
  const cardBlueSky15 = new SacrificeQuest(8, 1)
  const cardRedSky21 = new SacrificeQuest(10, 1)
  const cardYellowSky38 = new SacrificeQuest(19, 2)

  describe('BlueSky15 (sacrifice 1 sanctuary → 8 pts)', () => {
    it('zero sanctuaries → no score', () => {
      expect(cardBlueSky15.getScore([], [])).toBeUndefined()
    })
    it('exactly one sanctuary → 8 pts', () => {
      expect(cardBlueSky15.getScore([], [sanctuary(Sanctuary.Red5)])).toBe(8)
    })
    it('sanctuaries with regions present → still 8 pts (regions ignored)', () => {
      expect(cardBlueSky15.getScore(
        [region(Region.Red1), region(Region.Blue6)],
        [sanctuary(Sanctuary.Green4)]
      )).toBe(8)
    })
  })

  describe('RedSky21 (sacrifice 1 sanctuary → 10 pts)', () => {
    it('zero sanctuaries → no score', () => {
      expect(cardRedSky21.getScore([], [])).toBeUndefined()
    })
    it('one sanctuary → 10 pts', () => {
      expect(cardRedSky21.getScore([], [sanctuary(Sanctuary.Yellow3)])).toBe(10)
    })
    it('multiple sanctuaries — still 10 pts (one sacrifice is enough)', () => {
      expect(cardRedSky21.getScore(
        [],
        [sanctuary(Sanctuary.Red5), sanctuary(Sanctuary.Yellow3), sanctuary(Sanctuary.Gray9)]
      )).toBe(10)
    })
  })

  describe('YellowSky38 (sacrifice 2 sanctuaries → 19 pts)', () => {
    it('zero sanctuaries → no score', () => {
      expect(cardYellowSky38.getScore([], [])).toBeUndefined()
    })
    it('one sanctuary → no score (threshold not met)', () => {
      expect(cardYellowSky38.getScore([], [sanctuary(Sanctuary.Red5)])).toBeUndefined()
    })
    it('exactly two sanctuaries → 19 pts', () => {
      expect(cardYellowSky38.getScore(
        [],
        [sanctuary(Sanctuary.Red5), sanctuary(Sanctuary.Yellow3)]
      )).toBe(19)
    })
    it('three sanctuaries → still 19 pts (cannot stack the bonus)', () => {
      expect(cardYellowSky38.getScore(
        [],
        [sanctuary(Sanctuary.Red5), sanctuary(Sanctuary.Yellow3), sanctuary(Sanctuary.Gray9)]
      )).toBe(19)
    })
  })

  it('the sanctuary identity does not matter — only the count', () => {
    const quest = new SacrificeQuest(19, 2)
    // Two random sanctuaries of any kind should suffice.
    const cases = [
      [sanctuary(Sanctuary.Red5), sanctuary(Sanctuary.Yellow3)],
      [sanctuary(Sanctuary.Gray9), sanctuary(Sanctuary.Gray23)],
      [sanctuary(Sanctuary.Blue2), sanctuary(Sanctuary.Blue3)]
    ]
    for (const sancs of cases) {
      expect(quest.getScore([], sancs)).toBe(19)
    }
  })

  it('sky-card sanctuaries (none exist today, but should still be counted as sanctuaries)', () => {
    // This is forward-looking: count is what matters, not whether any specific
    // sanctuary is in Sanctuaries[].
    const quest = new SacrificeQuest(8, 1)
    expect(quest.getScore([], [sanctuary(0 as Sanctuary)])).toBe(8)
  })
})

describe('RequireClueQuest', () => {
  it('does not score when below the clue threshold', () => {
    const quest = new RequireClueQuest(17, 5)
    // Green8 has 1 clue, Green15 has 1 clue → 2 clues total < 5
    expect(quest.getScore([region(Region.Green8), region(Region.Green15)], [])).toBeUndefined()
  })

  it('scores when exactly meeting the threshold (regions only)', () => {
    const quest = new RequireClueQuest(17, 3)
    // Green8 + Green15 + Green58 → 3 clues
    expect(quest.getScore(
      [region(Region.Green8), region(Region.Green15), region(Region.Green58)], []
    )).toBe(17)
  })

  it('counts clues from sanctuaries in addition to regions', () => {
    const quest = new RequireClueQuest(17, 3)
    // Green8(1) + Green15(1) regions + Green4(1) sanctuary → 3 clues
    expect(quest.getScore(
      [region(Region.Green8), region(Region.Green15)],
      [sanctuary(Sanctuary.Green4)]
    )).toBe(17)
  })

  it('counts the 2-clue Starry Skies cards toward the threshold', () => {
    const quest = new RequireClueQuest(17, 5)
    // RedSky5 (2 clues) + GreenSky33 (2 clues) + Green58 (1 clue) = 5
    expect(quest.getScore(
      [region(Region.RedSky5), region(Region.GreenSky33), region(Region.Green58)], []
    )).toBe(17)
  })
})

describe('RequireColorQuest', () => {
  it('does not score when below the color threshold', () => {
    const quest = new RequireColorQuest(9, Color.Yellow, 4)
    // Only 3 yellow cards
    const regions = [
      region(Region.Yellow12), region(Region.Yellow25), region(Region.Yellow50)
    ]
    expect(quest.getScore(regions, [])).toBeUndefined()
  })

  it('scores when meeting the threshold by region count', () => {
    const quest = new RequireColorQuest(9, Color.Yellow, 4)
    const regions = [
      region(Region.Yellow12), region(Region.Yellow25),
      region(Region.Yellow50), region(Region.Yellow65)
    ]
    expect(quest.getScore(regions, [])).toBe(9)
  })

  it('combines region and sanctuary cards of the requested color', () => {
    const quest = new RequireColorQuest(9, Color.Yellow, 4)
    const regions = [
      region(Region.Yellow12), region(Region.Yellow25), region(Region.Yellow50)
    ]
    const sancs = [sanctuary(Sanctuary.Yellow2)]
    expect(quest.getScore(regions, sancs)).toBe(9)
  })

  it('does not count cards of a different color', () => {
    const quest = new RequireColorQuest(11, Color.Green, 4)
    const regions = [
      region(Region.Green5), region(Region.Green8), region(Region.Green15),
      region(Region.Red1), region(Region.Blue6) // wrong colors
    ]
    expect(quest.getScore(regions, [])).toBeUndefined()
  })

  it('counts a Starry Skies card of the matching color (e.g. green sky for green)', () => {
    const quest = new RequireColorQuest(11, Color.Green, 4)
    const regions = [
      region(Region.Green5), region(Region.Green8), region(Region.Green15),
      region(Region.GreenSky9) // 4th green
    ]
    expect(quest.getScore(regions, [])).toBe(11)
  })
})

describe('RequireNightQuest', () => {
  it('does not score when night markers are below the threshold', () => {
    const quest = new RequireNightQuest(21, 5)
    // Red23 + Red26 + Red28 = 3 nights only
    expect(quest.getScore(
      [region(Region.Red23), region(Region.Red26), region(Region.Red28)], []
    )).toBeUndefined()
  })

  it('scores when meeting the threshold across regions', () => {
    const quest = new RequireNightQuest(21, 5)
    // 5 NIGHT cards
    const regions = [
      region(Region.Red23), region(Region.Red26),
      region(Region.Red28), region(Region.Red30), region(Region.Red32)
    ]
    expect(quest.getScore(regions, [])).toBe(21)
  })

  it('counts night markers from sanctuaries', () => {
    const quest = new RequireNightQuest(21, 5)
    const regions = [
      region(Region.Red23), region(Region.Red26),
      region(Region.Red28), region(Region.Red30)
    ]
    // Sanctuary.Red5 has night: 1 → total 5
    expect(quest.getScore(regions, [sanctuary(Sanctuary.Red5)])).toBe(21)
  })

  it('counts the night markers of Starry Skies cards', () => {
    const quest = new RequireNightQuest(21, 5)
    // 5 sky NIGHT cards = 5 nights
    const regions = [
      region(Region.RedSky11), region(Region.GreenSky9), region(Region.BlueSky15),
      region(Region.YellowSky4), region(Region.GraySky7)
    ]
    expect(quest.getScore(regions, [])).toBe(21)
  })

  it('does not count Starry Skies day cards', () => {
    const quest = new RequireNightQuest(21, 5)
    // Only half the sky cards are night cards: RedSky21, GreenSky26 and
    // YellowSky38 are day cards, so these 5 sky cards carry 2 nights only.
    const regions = [
      region(Region.RedSky11), region(Region.RedSky21), region(Region.GreenSky26),
      region(Region.YellowSky38), region(Region.GraySky7)
    ]
    expect(quest.getScore(regions, [])).toBeUndefined()
  })
})

describe('MultiWonderSumQuest', () => {
  it('returns 0 when none of the scoring wonders are present', () => {
    const quest = new MultiWonderSumQuest(1, [Wonder.Chimera, Wonder.Thistle])
    expect(quest.getScore([region(Region.Blue43)], [])).toBe(0)
  })

  it('scores 1 point per matching wonder across all regions', () => {
    const quest = new MultiWonderSumQuest(1, [Wonder.Chimera, Wonder.Thistle])
    // Red1: [Chimera, Rock] → 1 chimera
    // Red4: [Thistle, Rock] → 1 thistle
    // Red7: [Chimera, Thistle] → 1 chimera, 1 thistle
    // Total scoring wonders = 4 → 4 points
    expect(quest.getScore(
      [region(Region.Red1), region(Region.Red4), region(Region.Red7)], []
    )).toBe(4)
  })

  it('combines scoring wonders from regions and sanctuaries', () => {
    const quest = new MultiWonderSumQuest(1, [Wonder.Chimera, Wonder.Rock])
    // Region Red1: 1 chimera + 1 rock = 2
    // Sanctuary Gray9: 1 chimera = 1
    // Sanctuary GrayExp1: 2 rocks = 2
    // Total = 5
    expect(quest.getScore(
      [region(Region.Red1)],
      [sanctuary(Sanctuary.Gray9), sanctuary(Sanctuary.GrayExp1)]
    )).toBe(5)
  })

  it('respects the points-per-wonder multiplier', () => {
    const quest = new MultiWonderSumQuest(2, [Wonder.Rock])
    // Red1: [Chimera, Rock] → 1 rock × 2 = 2
    expect(quest.getScore([region(Region.Red1)], [])).toBe(2)
  })
})

describe('Region helpers — Starry Skies', () => {
  it('isStarrySkies identifies sky cards by id range', () => {
    expect(isStarrySkies(Region.Red1)).toBe(false)
    expect(isStarrySkies(Region.GrayExp0)).toBe(false)
    expect(isStarrySkies(Region.RedSky5)).toBe(true)
    expect(isStarrySkies(Region.GraySky29)).toBe(true)
  })

  it('compareTime falls back to value when neither is a sky card', () => {
    expect(compareTime(Region.Red4, Region.Red7)).toBeLessThan(0)
    expect(compareTime(Region.Red7, Region.Red4)).toBeGreaterThan(0)
  })

  it('compareTime breaks value ties in favor of Starry Skies cards', () => {
    // Both have value 5, RedSky5 should come "after" Green5
    expect(compareTime(Region.Green5, Region.RedSky5)).toBeLessThan(0)
    expect(compareTime(Region.RedSky5, Region.Green5)).toBeGreaterThan(0)
  })

  it('compareTime returns 0 when ids are equivalent', () => {
    expect(compareTime(Region.Red4, Region.Red4)).toBe(0)
  })
})

describe('stayedVisible', () => {
  it('a sky card is always visible', () => {
    expect(stayedVisible(Region.RedSky5, [Region.RedSky5])).toBe(true)
  })

  it('without any sky card in the line, no non-sky card stays visible', () => {
    expect(stayedVisible(Region.Red7, [Region.Red1, Region.Red7, Region.Green5])).toBe(false)
  })

  it('a non-sky card stays visible when its ones digit matches a sky cards ones digit', () => {
    // GreenSky9 → ones digit 9. Region.Red19 → ones digit 9. Should stay visible.
    expect(stayedVisible(Region.Red19, [Region.Red19, Region.GreenSky9])).toBe(true)
  })

  it('a non-sky card with a non-matching ones digit does not stay visible', () => {
    // GreenSky9 → ones digit 9. Region.Red4 → ones digit 4. Not visible.
    expect(stayedVisible(Region.Red4, [Region.Red4, Region.GreenSky9])).toBe(false)
  })

  it('with multiple sky cards, a card stays visible if it matches any sky card', () => {
    // RedSky5 → 5, GreenSky9 → 9. Region.Yellow25 → 5. Matches RedSky5.
    expect(stayedVisible(Region.Yellow25, [Region.Yellow25, Region.RedSky5, Region.GreenSky9])).toBe(true)
  })
})
