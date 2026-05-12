import { MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { Memory } from '../../rules/Memory'
import { Region } from '../Region'
import { Sanctuary } from '../Sanctuary'
import { Quest } from './Quest'
import { QuestType } from './QuestType'

class SacrificeRules extends MaterialRulesPart {}

/**
 * Quest from the Starry Skies extension: when scoring this card, the player may discard
 * `sanctuariesToSacrifice` of their Sanctuaries to score `points`.
 *
 * The sacrifice happens during {@link SacrificeSanctuaryRule} (BEFORE Scoring runs at
 * each x): the player moves sanctuaries from their PlayerSanctuaryLine to the
 * SanctuaryDeck. The rule writes the count of sanctuaries sacrificed at each x into
 * Memory.SacrificesByX; here at scoring time we look up that count for this card's x
 * and compare against this quest's cost.
 *
 * The base-class `getScore(regions, sanctuaries)` is kept for the eligibility helper
 * and unit tests; the final score goes through the override below.
 */
export class SacrificeQuest extends Quest {
  type = QuestType.Sacrifice

  constructor(readonly points: number, readonly sanctuariesToSacrifice: number) {
    super(points)
  }

  override getTotalScore(game: MaterialGame, cardIndex: number, _cardType: MaterialType, playerId: PlayerId): number {
    const rules = new SacrificeRules(game)
    const card = rules.material(MaterialType.Region).getItem(cardIndex)
    if (card?.location.x === undefined) return 0
    const map = rules.remind<Record<number, Record<PlayerId, number>>>(Memory.SacrificesByX) ?? {}
    const sacrificed = map[card.location.x]?.[playerId] ?? 0
    return sacrificed >= this.sanctuariesToSacrifice ? this.points : 0
  }

  getScore(_regions: MaterialItem<PlayerId, LocationType, Region>[], sanctuaries: MaterialItem<PlayerId, LocationType, Sanctuary>[]): number | undefined {
    return sanctuaries.length >= this.sanctuariesToSacrifice ? this.points : undefined
  }
}
