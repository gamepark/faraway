import { Region } from '@gamepark/faraway/cards/Region'
import { RegionQuests } from '@gamepark/faraway/cards/RegionQuests'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { ScoreHelper } from '@gamepark/faraway/rules/helper/ScoreHelper'
import { FlatMaterialDescription, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import ScoreSheet from '../images/ScoreSheet.jpg'
import { ScoreSheetHelp } from './help/ScoreSheetHelp'


export class ScoreSheetDescription extends FlatMaterialDescription {
  width = 7.2
  height = 9.9

  image = ScoreSheet

  staticItem = {
    location: {
      type: LocationType.ScoreSheet
    }
  }

  getLocations(_item: MaterialItem, context: ItemContext) {
    const rules = context.rules as FarawayRules
    if (!rules.isOver()) return []
    const locations: Location[] = []
    const regions = rules.material(MaterialType.Region).location(LocationType.PlayerRegionLine).sort(item => -item.location.x!)
    for (const index of regions.getIndexes()) {
      const region = regions.getItem<Region>(index)!
      const regionQuest = RegionQuests[region.id!]
      locations.push({
        type: LocationType.ScoreSheetBox,
        id: regionQuest?.getTotalScore(rules.game, index, MaterialType.Region, region.location.player!) ?? '',
        parent: 0,
        x: region.location.player,
        y: 8 - region.location.x!
      })
    }
    for (const player of rules.players) {
      locations.push({
        type: LocationType.ScoreSheetBox,
        id: player,
        parent: 0,
        x: player,
        y: 0
      })
      locations.push({
        type: LocationType.ScoreSheetBox,
        id: new ScoreHelper(rules.game, player).sanctuaryScore,
        parent: 0,
        x: player,
        y: 9
      })
      locations.push({
        type: LocationType.ScoreSheetBox,
        id: new ScoreHelper(rules.game, player).score,
        parent: 0,
        x: player,
        y: 10
      })
    }
    return locations
  }

  help = ScoreSheetHelp
}

export const scoreSheetDescription = new ScoreSheetDescription()