import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { DropAreaDescription, LocationHelpProps, MaterialListHelp } from '@gamepark/react-game'
import { regionCardDescription } from '../../material/RegionCardDescription'
import { regionDiscardScale } from '../../panels/PanelConstants'

/**
 * Drop-area description for the region discard pile. Plugs the framework's
 * {@link MaterialListHelp} as the location help so clicking the pile opens a
 * grid of every discarded card with click-through to each card's own help.
 */
export class RegionDiscardAreaDescription extends DropAreaDescription {
  width = regionCardDescription.width * regionDiscardScale
  height = regionCardDescription.height * regionDiscardScale
  borderRadius = regionCardDescription.borderRadius

  help = (props: LocationHelpProps) => (
    <MaterialListHelp
      type={MaterialType.Region}
      location={props.location}
      titleKey="help.region.discard.title"
      countKey="help.region.discard.count"
      maxCols={5}
    />
  )
}
