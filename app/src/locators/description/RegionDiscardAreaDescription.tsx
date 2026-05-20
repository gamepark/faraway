import { DropAreaDescription } from '@gamepark/react-game'
import { RegionDiscardHelp } from '../../material/help/RegionDiscardHelp'

/**
 * Drop-area description for the region discard pile. Carries the
 * {@link RegionDiscardHelp} dialog so clicking the pile opens a grid of every
 * discarded card with click-through to each card's own help.
 */
export class RegionDiscardAreaDescription extends DropAreaDescription {
  help = RegionDiscardHelp
}
