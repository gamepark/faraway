import { Spirit } from '@gamepark/faraway/cards/Spirit'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { CardDescription, fontSizeCss, ItemContext, MaterialContext } from '@gamepark/react-game'
import { spiritHeight, spiritWidth } from '../panels/PanelConstants'
import { isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { FarawayMenuButton, HandIcon } from '../components/ItemMenuButton'
import { UnavailableSpiritButton } from '../extension/UnavailableSpiritButton'
import Axolotl from '../images/spirit/spirit_axolotl.webp'
import SpiritBack from '../images/spirit/spirit_back.webp'
import Bat from '../images/spirit/spirit_bat.webp'
import Bear from '../images/spirit/spirit_bear.webp'
import Fish from '../images/spirit/spirit_fish.webp'
import Fox from '../images/spirit/spirit_fox.webp'
import Frog from '../images/spirit/spirit_frog.webp'
import Iguana from '../images/spirit/spirit_iguana.webp'
import Monkey from '../images/spirit/spirit_monkey.webp'
import Moth from '../images/spirit/spirit_moth.webp'
import Owl from '../images/spirit/spirit_owl.webp'
import Ram from '../images/spirit/spirit_ram.webp'
import Snake from '../images/spirit/spirit_snake.webp'
import Turkey from '../images/spirit/spirit_turkey.webp'
import { isResolvedRegion } from './RegionCardDescription'
import { SpiritCardHelp } from './help/SpiritCardHelp'

/**
 * Beyond the Veil: Spirit cards. They are as wide as the Region cards, so that once slid under a Region only their top
 * (resources) and bottom (points) stick out.
 */
export class SpiritCardDescription extends CardDescription {
  // Real card size: 75.2 x 106.3 mm, against 70 x 70 mm for a Region card, so it sticks out on every side.
  // The box is the artwork, slightly larger: 1 mm of press-file margin plus the drop shadow baked into the image
  // (the framework draws no CSS shadow on a transparent one).
  width = spiritWidth
  height = spiritHeight
  borderRadius = 0
  transparency = true

  backImage = SpiritBack

  images = {
    [Spirit.Axolotl]: Axolotl,
    [Spirit.Bat]: Bat,
    [Spirit.Bear]: Bear,
    [Spirit.Fish]: Fish,
    [Spirit.Fox]: Fox,
    [Spirit.Frog]: Frog,
    [Spirit.Iguana]: Iguana,
    [Spirit.Monkey]: Monkey,
    [Spirit.Moth]: Moth,
    [Spirit.Owl]: Owl,
    [Spirit.Ram]: Ram,
    [Spirit.Snake]: Snake,
    [Spirit.Turkey]: Turkey
  }

  /**
   * A Spirit under a Region card is turned face down with it at the end of the game, and revealed with it during scoring.
   * Deriving the face from the parent Region (instead of moving the Spirit too) lets the framework animate the Spirit as a
   * child of the Region: both cards flip in the same animation.
   */
  isFlippedOnTable(item: MaterialItem, context: MaterialContext) {
    if (item.location.type === LocationType.PlayerSpirit && item.location.parent !== undefined) {
      const region = context.rules.material(MaterialType.Region).getItem(item.location.parent)
      if (region?.location.rotation === false) return true
    }
    return super.isFlippedOnTable(item, context)
  }

  getLocations(item: MaterialItem, context: ItemContext) {
    if (item.location.type !== LocationType.PlayerSpirit || item.location.parent === undefined) return []
    const region = context.rules.material(MaterialType.Region).getItem(item.location.parent)
    if (!region || region.location.rotation !== true || !isResolvedRegion(region, context)) return []
    return [{ type: LocationType.SpiritScorePoints, parent: context.index }]
  }

  menuAlwaysVisible = true

  getItemMenu(item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    const takeMove = legalMoves.find(move => isMoveItemType(MaterialType.Spirit)(move) && move.itemIndex === context.index)
    if (takeMove) {
      return <FarawayMenuButton angle={180} radius={0} icon={HandIcon} titleKey="button.spirit.take" move={takeMove}/>
    }
    // The revealed card of the deck is easily mistaken for a 3rd available Spirit: say that it cannot be taken yet
    if (item.location.type === LocationType.SpiritDeck && item.location.rotation) {
      return <UnavailableSpiritButton/>
    }
    return null
  }

  getHelpDisplayExtraCss(item: MaterialItem, context: ItemContext) {
    return [fontSizeCss(7), super.getHelpDisplayExtraCss(item, context)]
  }

  help = SpiritCardHelp
}

export const spiritCardDescription = new SpiritCardDescription()
