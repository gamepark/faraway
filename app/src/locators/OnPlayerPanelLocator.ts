import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { getRelativePlayerIndex, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { getPanelPosition, getPanelStagingPosition, tableYMax, tableYMin } from '../panels/PanelConstants'
import { getViewPlayer } from './panelCoordinates'

// Cards are 7em tall — half-height to keep them inside the table.
const CARD_HALF_HEIGHT = 3.5
const CARD_TABLE_PADDING = 0.3

/**
 * If `location.rotation` is explicitly `true` or `false`, returns the matching
 * `rotateY(...)` so CSS interpolates the card flip between waypoints. When it
 * is `undefined`, returns nothing — leaves the existing pick-trajectory behavior
 * (no `rotateY`) untouched.
 */
const faceTransform = (item: MaterialItem): string | undefined => {
  if (item.location.rotation === false) return 'rotateY(180deg)'
  if (item.location.rotation === true) return 'rotateY(0deg)'
  return undefined
}

/**
 * Animation-only locator: positions items at a player's panel center.
 * Items for players other than the viewed one are scaled to 0 (invisible but animated).
 */
class OnPlayerPanelLocator extends ListLocator {
  getGap(): Partial<Coordinates> {
    return { z: 0.05 }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    const transforms = super.placeItem(item, context)
    // Non-viewed players: use scale(0.001) instead of scale(0) — some browsers
    // skip transform interpolation entirely when the matrix collapses to zero,
    // which breaks the fly-in animation.
    const scale = item.location.player !== getViewPlayer(context) ? 'scale(0.001)' : 'scale(1)'
    const face = faceTransform(item)
    return face ? [...transforms, scale, face] : [...transforms, scale]
  }

  getCoordinates(location: Location, context: MaterialContext) {
    const index = getRelativePlayerIndex(context, location.player)
    const { x, y } = getPanelPosition(index, context.rules.players.length)
    // Default z=10 keeps panel-anchored cards above the rest of the table during
    // animations. Trajectories can override this on a per-waypoint basis by
    // passing `location.z` (e.g. the discard-from-panel trajectory drops the
    // card to z=0 at the start so it slides UNDER the viewed player's hand
    // before flying to the deck).
    return { x, y, z: location.z ?? 10 }
  }
}

export const onPlayerPanelLocator = new OnPlayerPanelLocator()

/**
 * Animation-only locator: positions items just left of a player's panel (panels are
 * pinned to the right edge, so "inside" the panel = toward table center).
 */
class BesidePanelLocator extends ListLocator {
  getGap(): Partial<Coordinates> {
    return { z: 0.05 }
  }

  getCoordinates(location: Location, context: MaterialContext) {
    const index = getRelativePlayerIndex(context, location.player)
    const { x, y } = getPanelStagingPosition(index, context.rules.players.length, 2)
    return { x, y, z: 10 }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    const transforms = [...super.placeItem(item, context), 'scale(1)']
    const face = faceTransform(item)
    return face ? [...transforms, face] : transforms
  }
}

export const besidePanelLocator = new BesidePanelLocator()

/**
 * Same as {@link besidePanelLocator} but pushed a bit further out — used as a card-sized
 * waypoint so region/sanctuary cards don't overlap the panel during the fly-in.
 */
class BesidePanelCardLocator extends BesidePanelLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const index = getRelativePlayerIndex(context, location.player)
    const { x, y } = getPanelStagingPosition(index, context.rules.players.length, 3.5)
    // Keep the card fully on-screen: its center must stay within the table by at least half the card height.
    const minY = tableYMin + CARD_HALF_HEIGHT + CARD_TABLE_PADDING
    const maxY = tableYMax - CARD_HALF_HEIGHT - CARD_TABLE_PADDING
    const clampedY = Math.min(maxY, Math.max(minY, y))
    return { x, y: clampedY, z: 10 }
  }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    // Region cards are square (7em), sanctuaries are portrait (4.4em wide).
    // Panels are pinned to the right edge, so region cards need a small
    // leftward nudge to keep a comparable visual gap with the panel.
    //
    // The shift must be injected BEFORE the rotateY face transform — once
    // the card is flipped (rotateY(180deg)), CSS X is mirrored, so a
    // post-rotateY translateX would push face-down cards to the wrong side.
    // super.placeItem() (BesidePanelLocator) appends `scale` then optional
    // `face`; we re-do the chain here so the shift sits between scale and
    // face.
    const baseTransforms = super.placeItem(item, context)
    // Strip face transform if present (last item) so we can re-append it
    // after the shift.
    const face = faceTransform(item)
    const positional = face ? baseTransforms.slice(0, -1) : baseTransforms
    const shifted = context.type === MaterialType.Region
      ? [...positional, 'translateX(-1em)']
      : positional
    return face ? [...shifted, face] : shifted
  }
}

export const besidePanelCardLocator = new BesidePanelCardLocator()
