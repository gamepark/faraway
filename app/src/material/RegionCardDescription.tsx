import { Region } from '@gamepark/faraway/cards/Region'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { CardDescription, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import Blue13 from '../images/region/region_blue_13.jpg'
import Blue17 from '../images/region/region_blue_17.jpg'
import Blue2 from '../images/region/region_blue_2.jpg'
import Blue21 from '../images/region/region_blue_21.jpg'
import Blue24 from '../images/region/region_blue_24.jpg'
import Blue40 from '../images/region/region_blue_40.jpg'
import Blue43 from '../images/region/region_blue_43.jpg'
import Blue46 from '../images/region/region_blue_46.jpg'
import Blue49 from '../images/region/region_blue_49.jpg'
import Blue51 from '../images/region/region_blue_51.jpg'
import Blue55 from '../images/region/region_blue_55.jpg'
import Blue6 from '../images/region/region_blue_6.jpg'
import Blue60 from '../images/region/region_blue_60.jpg'
import Blue64 from '../images/region/region_blue_64.jpg'
import Blue66 from '../images/region/region_blue_66.jpg'
import Blue68 from '../images/region/region_blue_68.jpg'
import Blue9 from '../images/region/region_blue_9.jpg'
import RegionBack from '../images/region/region_card_back.jpg'
import Green11 from '../images/region/region_green_11.jpg'
import Green15 from '../images/region/region_green_15.jpg'
import Green18 from '../images/region/region_green_18.jpg'
import Green20 from '../images/region/region_green_20.jpg'
import Green22 from '../images/region/region_green_22.jpg'
import Green3 from '../images/region/region_green_3.jpg'
import Green34 from '../images/region/region_green_34.jpg'
import Green38 from '../images/region/region_green_38.jpg'
import Green41 from '../images/region/region_green_41.jpg'
import Green45 from '../images/region/region_green_45.jpg'
import Green5 from '../images/region/region_green_5.jpg'
import Green54 from '../images/region/region_green_54.jpg'
import Green58 from '../images/region/region_green_58.jpg'
import Green61 from '../images/region/region_green_61.jpg'
import Green63 from '../images/region/region_green_63.jpg'
import Green67 from '../images/region/region_green_67.jpg'
import Green8 from '../images/region/region_green_8.jpg'
import Red1 from '../images/region/region_red_1.jpg'
import Red10 from '../images/region/region_red_10.jpg'
import Red14 from '../images/region/region_red_14.jpg'
import Red16 from '../images/region/region_red_16.jpg'
import Red19 from '../images/region/region_red_19.jpg'
import Red23 from '../images/region/region_red_23.jpg'
import Red26 from '../images/region/region_red_26.jpg'
import Red28 from '../images/region/region_red_28.jpg'
import Red30 from '../images/region/region_red_30.jpg'
import Red32 from '../images/region/region_red_32.jpg'
import Red36 from '../images/region/region_red_36.jpg'
import Red39 from '../images/region/region_red_39.jpg'
import Red4 from '../images/region/region_red_4.jpg'
import Red48 from '../images/region/region_red_48.jpg'
import Red52 from '../images/region/region_red_52.jpg'
import Red57 from '../images/region/region_red_57.jpg'
import Red7 from '../images/region/region_red_7.jpg'
import Yellow12 from '../images/region/region_yellow_12.jpg'
import Yellow25 from '../images/region/region_yellow_25.jpg'
import Yellow27 from '../images/region/region_yellow_27.jpg'
import Yellow29 from '../images/region/region_yellow_29.jpg'
import Yellow31 from '../images/region/region_yellow_31.jpg'
import Yellow33 from '../images/region/region_yellow_33.jpg'
import Yellow35 from '../images/region/region_yellow_35.jpg'
import Yellow37 from '../images/region/region_yellow_37.jpg'
import Yellow42 from '../images/region/region_yellow_42.jpg'
import Yellow44 from '../images/region/region_yellow_44.jpg'
import Yellow47 from '../images/region/region_yellow_47.jpg'
import Yellow50 from '../images/region/region_yellow_50.jpg'
import Yellow53 from '../images/region/region_yellow_53.jpg'
import Yellow56 from '../images/region/region_yellow_56.jpg'
import Yellow59 from '../images/region/region_yellow_59.jpg'
import Yellow62 from '../images/region/region_yellow_62.jpg'
import Yellow65 from '../images/region/region_yellow_65.jpg'
import { RegionCardHelp } from './help/RegionCardHelp'


export class RegionCardDescription extends CardDescription {
  height = 7
  width = 7
  borderRadius = 0.5

  backImage = RegionBack

  images = {
    [Region.Red1]: Red1,
    [Region.Red4]: Red4,
    [Region.Red7]: Red7,
    [Region.Red10]: Red10,
    [Region.Red14]: Red14,
    [Region.Red16]: Red16,
    [Region.Red19]: Red19,
    [Region.Red23]: Red23,
    [Region.Red26]: Red26,
    [Region.Red28]: Red28,
    [Region.Red30]: Red30,
    [Region.Red32]: Red32,
    [Region.Red36]: Red36,
    [Region.Red39]: Red39,
    [Region.Red48]: Red48,
    [Region.Red52]: Red52,
    [Region.Red57]: Red57,
    [Region.Green3]: Green3,
    [Region.Green5]: Green5,
    [Region.Green8]: Green8,
    [Region.Green11]: Green11,
    [Region.Green15]: Green15,
    [Region.Green18]: Green18,
    [Region.Green20]: Green20,
    [Region.Green22]: Green22,
    [Region.Green34]: Green34,
    [Region.Green38]: Green38,
    [Region.Green41]: Green41,
    [Region.Green45]: Green45,
    [Region.Green54]: Green54,
    [Region.Green58]: Green58,
    [Region.Green61]: Green61,
    [Region.Green63]: Green63,
    [Region.Green67]: Green67,
    [Region.Blue2]: Blue2,
    [Region.Blue6]: Blue6,
    [Region.Blue9]: Blue9,
    [Region.Blue13]: Blue13,
    [Region.Blue17]: Blue17,
    [Region.Blue21]: Blue21,
    [Region.Blue24]: Blue24,
    [Region.Blue40]: Blue40,
    [Region.Blue43]: Blue43,
    [Region.Blue46]: Blue46,
    [Region.Blue49]: Blue49,
    [Region.Blue51]: Blue51,
    [Region.Blue55]: Blue55,
    [Region.Blue60]: Blue60,
    [Region.Blue64]: Blue64,
    [Region.Blue66]: Blue66,
    [Region.Blue68]: Blue68,
    [Region.Yellow12]: Yellow12,
    [Region.Yellow25]: Yellow25,
    [Region.Yellow27]: Yellow27,
    [Region.Yellow29]: Yellow29,
    [Region.Yellow31]: Yellow31,
    [Region.Yellow33]: Yellow33,
    [Region.Yellow35]: Yellow35,
    [Region.Yellow37]: Yellow37,
    [Region.Yellow42]: Yellow42,
    [Region.Yellow44]: Yellow44,
    [Region.Yellow47]: Yellow47,
    [Region.Yellow50]: Yellow50,
    [Region.Yellow53]: Yellow53,
    [Region.Yellow56]: Yellow56,
    [Region.Yellow59]: Yellow59,
    [Region.Yellow62]: Yellow62,
    [Region.Yellow65]: Yellow65,
  }

  getLocations(item: MaterialItem, context: ItemContext) {
    if (item.location.type !== LocationType.PlayerRegionLine || (context.rules.game.rule && context.rules.game.rule?.id !== RuleId.Scoring)) return []
    return [{
      type: LocationType.RegionScorePoints,
      parent: context.index
    }]
  }

  help = RegionCardHelp
}

export const regionCardDescription = new RegionCardDescription()