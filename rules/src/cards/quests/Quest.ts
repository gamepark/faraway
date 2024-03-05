import { MaterialGame, MaterialItem } from '@gamepark/rules-api'
import sum from 'lodash/sum'
import { FarawayRules } from '../../FarawayRules'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { Regions } from '../Regions'
import { Sanctuaries } from '../Sanctuaries'
import { Wonder } from '../Wonder'

export abstract class Quest {

  constructor(readonly points: number, readonly wonders: Wonder[] = []) {
  }

  getTotalScore(game: MaterialGame, cardIndex: number, playerId: PlayerId) {
    const rules = new FarawayRules(game)
    const card = rules.material(MaterialType.Region).getItem(cardIndex)!
    const locationX = card.location.x!
    const regions = this.getRegions(game, locationX, playerId)
    const sanctuaries = this.getSanctuaries(game, playerId)
    const chimeras = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Chimera)
    const rocks = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Rock)
    const thistles = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Thistle)

    if (chimeras >= this.chimeras && rocks >= this.rocks && thistles >= this.thistles) {
      return this.getScore(regions, sanctuaries, playerId) ?? 0
    }

    return 0
  }

  get chimeras() {
    return this.wonders.filter((w) => w === Wonder.Chimera).length
  }

  get rocks() {
    return this.wonders.filter((w) => w === Wonder.Rock).length
  }

  get thistles() {
    return this.wonders.filter((w) => w === Wonder.Thistle).length
  }

  getPlayerWonderCount(regions: MaterialItem[], sanctuaries: MaterialItem[], wonder: Wonder) {
    return sum(
      [
        ...regions.map((r) => (Regions[r.id]?.wonders ?? []).filter((w: Wonder) => w === wonder).length),
        ...sanctuaries.map((s) => (Sanctuaries[s.id]?.wonders ?? []).filter((w: Wonder) => w === wonder).length)
      ]
    )
  }

  getRegions(game: MaterialGame, locationX: number, playerId: PlayerId) {
    const rules = new FarawayRules(game)
    return rules.material(MaterialType.Region).player(playerId).location((location) => location.type === LocationType.PlayerRegionLine && location.x! >= locationX).getItems()
  }

  getSanctuaries(game: MaterialGame, playerId: PlayerId) {
    const rules = new FarawayRules(game)
    return rules.material(MaterialType.Sanctuary).player(playerId).location(LocationType.PlayerSanctuaryLine).getItems()
  }

  abstract getScore(regions: MaterialItem[], sanctuaries: MaterialItem[], _playerId: PlayerId): number | undefined
}