import { MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { sum } from 'es-toolkit/compat'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { Region, stayedVisible } from '../Region'
import { Regions } from '../Regions'
import { Sanctuaries } from '../Sanctuaries'
import { Sanctuary } from '../Sanctuary'
import { Wonder } from '../Wonder'
import { QuestType } from './QuestType'

class QuestRules extends MaterialRulesPart {}

export abstract class Quest {
  abstract type: QuestType

  constructor(readonly points: number, readonly wonders: Wonder[] = []) {
  }

  getTotalScore(game: MaterialGame, cardIndex: number, cardType: MaterialType, playerId: PlayerId) {
    const rules = new QuestRules(game)
    const card = rules.material(cardType).getItem(cardIndex)
    const locationX = card.location.x!
    const sanctuaryLocationX = cardType === MaterialType.Sanctuary ? undefined : locationX
    const regions = this.getRegions(game, sanctuaryLocationX, playerId)
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

  getPlayerWonderCount(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[], wonder: Wonder) {
    return sum(
      [
        ...regions.map((r) => (Regions[r.id]?.wonders ?? []).filter((w: Wonder) => w === wonder).length),
        ...sanctuaries.map((s) => (Sanctuaries[s.id]?.wonders ?? []).filter((w: Wonder) => w === wonder).length)
      ]
    )
  }

  getRegions(game: MaterialGame, locationX: number | undefined, playerId: PlayerId) {
    const rules = new QuestRules(game)
    const allPlayerRegions = rules.material(MaterialType.Region)
      .player(playerId)
      .location(LocationType.PlayerRegionLine)
      .getItems<Region>()
    if (locationX === undefined) return allPlayerRegions
    // A card counts toward another card's quest scoring if it has been revealed by the
    // time the current card is scored (x >= locationX) — OR if it stays visible across
    // the whole decompte (Starry Skies meteors and digit-matched cards), in which case
    // it counts even from the left of the scored card.
    const playerCardIds = allPlayerRegions.map(r => r.id)
    return allPlayerRegions.filter(
      r => r.location.x! >= locationX || stayedVisible(r.id, playerCardIds)
    )
  }

  getSanctuaries(game: MaterialGame, playerId: PlayerId) {
    const rules = new QuestRules(game)
    return rules.material(MaterialType.Sanctuary)
      .player(playerId)
      .location(LocationType.PlayerSanctuaryLine)
      .getItems<Sanctuary>()
  }

  abstract getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[], _playerId: PlayerId): number | undefined
}
