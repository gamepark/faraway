import { MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { countWonders } from '../CardCounting'
import { Region, stayedVisible } from '../Region'
import { Sanctuary } from '../Sanctuary'
import { Spirit } from '../Spirit'
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
    const spirits = getAttachedSpirits(game, playerId, regions)
    const chimeras = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Chimera, spirits)
    const rocks = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Rock, spirits)
    const thistles = this.getPlayerWonderCount(regions, sanctuaries, Wonder.Thistle, spirits)

    if (chimeras >= this.chimeras && rocks >= this.rocks && thistles >= this.thistles) {
      return this.getScore(regions, sanctuaries, playerId, spirits) ?? 0
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

  getPlayerWonderCount(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[], wonder: Wonder,
                       spirits: MaterialItem<PlayerId, LocationType, Spirit>[] = []) {
    return countWonders(wonder, { regions, sanctuaries, spirits })
  }

  getRegions(game: MaterialGame, locationX: number | undefined, playerId: PlayerId) {
    return getVisibleRegions(game, playerId, locationX)
  }

  getSanctuaries(game: MaterialGame, playerId: PlayerId) {
    const rules = new QuestRules(game)
    return rules.material(MaterialType.Sanctuary)
      .player(playerId)
      .location(LocationType.PlayerSanctuaryLine)
      .getItems<Sanctuary>()
  }

  /**
   * @param regions Visible regions of the player
   * @param sanctuaries Sanctuaries of the player
   * @param _playerId The player
   * @param spirits Beyond the Veil: Spirits attached to the visible regions
   */
  abstract getScore(regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[], _playerId?: PlayerId,
                    spirits?: MaterialItem<PlayerId, LocationType, Spirit>[]): number | undefined
}

/**
 * The regions of a player that are visible when the card at `locationX` is scored (all of them when `locationX` is undefined).
 */
export const getVisibleRegions = (game: MaterialGame, playerId: PlayerId, locationX?: number) => {
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

/**
 * Beyond the Veil: the Spirits of a player attached to some regions. A Spirit is visible whenever its Region is.
 */
export const getAttachedSpirits = (game: MaterialGame, playerId: PlayerId, regions: MaterialItem<PlayerId, LocationType, Region>[]) => {
  if (!game.items[MaterialType.Spirit]?.length) return []
  const xs = regions.map(region => region.location.x)
  return new QuestRules(game).material(MaterialType.Spirit)
    .location(LocationType.PlayerSpirit)
    .player(playerId)
    .location(location => xs.includes(location.x))
    .getItems<Spirit>()
}
