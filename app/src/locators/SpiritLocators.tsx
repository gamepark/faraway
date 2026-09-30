import { css } from '@emotion/react'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { getSpiritCardScore } from '@gamepark/faraway/rules/helper/ScoreHelper'
import { DeckLocator, ListLocator, LocationDescription, Locator, MaterialContext, useRules } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { availableSpiritGapY, getAvailableSpiritsPosition, getSpiritDeckPosition } from '../panels/PanelConstants'
import { ScoreBubble } from './description/RegionScorePointBubble'

class SpiritDeckLocator extends DeckLocator {
  getCoordinates() {
    return getSpiritDeckPosition()
  }

  // Only the top card is revealed: there is nothing to look closer at on the others.
  getHoverTransform(item: MaterialItem) {
    return item.location.rotation ? ['translateZ(10em)', 'scale(1.4)'] : []
  }
}

/** The 2 available Spirits, stacked under the deck in the left column. */
class AvailableSpiritLocator extends ListLocator {
  gap = { y: availableSpiritGapY }

  getCoordinates() {
    return getAvailableSpiritsPosition()
  }

  getHoverTransform() {
    return ['translateZ(10em)', 'scale(1.4)']
  }
}

/**
 * A Spirit is placed under the Region card it is attached to: it is a child item of the Region, so it follows it wherever it
 * goes, and flips with it (see SpiritCardDescription.isFlippedOnTable).
 */
class PlayerSpiritLocator extends Locator {
  parentItemType = MaterialType.Region
  coordinates = { z: -0.1 }

  // The face of the Spirit depends on the rotation of its Region: re-render when it changes
  getPositionDependencies(location: Location, context: MaterialContext) {
    return { regionRotation: context.rules.material(MaterialType.Region).getItem(location.parent!)?.location.rotation ?? null }
  }

  getHoverTransform() {
    return ['translateZ(10em)', 'scale(2)']
  }
}

const SpiritScoreBubble: FC<{ location: Location }> = ({ location }) => {
  const rules = useRules<FarawayRules>()!
  return <ScoreBubble score={getSpiritCardScore(rules.game, location.parent!)}/>
}

class SpiritScorePointDescription extends LocationDescription {
  height = 2
  width = 2
  extraCss = css`touch-action: none; pointer-events: none`
  content = SpiritScoreBubble
}

class SpiritScorePointLocator extends Locator {
  locationDescription = new SpiritScorePointDescription()
  parentItemType = MaterialType.Spirit
  positionOnParent = { x: 78, y: 92 }
}

export const spiritDeckLocator = new SpiritDeckLocator()
export const availableSpiritLocator = new AvailableSpiritLocator()
export const playerSpiritLocator = new PlayerSpiritLocator()
export const spiritScorePointLocator = new SpiritScorePointLocator()
