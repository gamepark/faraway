import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType, isShuffle, MaterialItem, MoveItem } from '@gamepark/rules-api'
import { besidePanelCardLocator, onPlayerPanelLocator } from '../locators/OnPlayerPanelLocator'
import { getViewPlayer } from '../locators/panelCoordinates'

export const farawayAnimations = new MaterialGameAnimations()

farawayAnimations.when()
  .move((move) => isMoveItemType(MaterialType.Region)(move) && move.location.type === LocationType.Region)
  .duration(0.5)

farawayAnimations.when()
  .move((move) => isMoveItemType(MaterialType.Region)(move) && move.location.type === LocationType.RegionDiscard)
  .duration(0.5)

farawayAnimations.when()
  .move((move) => isMoveItemType(MaterialType.Sanctuary)(move)
    && (move.location.type === LocationType.SanctuaryDeck || move.location.type === LocationType.PlayerSanctuaryHand))
  .duration(0.3)

farawayAnimations.when()
  .move(isShuffle)
  .none()

// --- Single-player-view: route animations for non-viewed players via panel waypoints ---

const toPanel = (playerId: number) => (_item: MaterialItem) => ({ player: playerId })

const isRegionToNonViewedPlayerZone = (move: MoveItem, viewed: number | undefined): boolean =>
  isMoveItemType(MaterialType.Region)(move)
  && (move.location.type === LocationType.PlayerRegionHand || move.location.type === LocationType.PlayerRegionLine)
  && move.location.player !== undefined
  && move.location.player !== viewed

const isSanctuaryToNonViewedPlayerZone = (move: MoveItem, viewed: number | undefined): boolean =>
  isMoveItemType(MaterialType.Sanctuary)(move)
  && (move.location.type === LocationType.PlayerSanctuaryHand || move.location.type === LocationType.PlayerSanctuaryLine)
  && move.location.player !== undefined
  && move.location.player !== viewed

/**
 * "Pick" trajectory for a card drawn/placed in a non-viewed player's zone.
 * The card surfaces left of the panel, rests there long enough to be read, then slides onto the panel.
 */
const pickTrajectory = (_context: unknown, move: MoveItem) => {
  const target = toPanel(move.location.player as number)
  return {
    waypoints: [
      { at: 0.25, locator: besidePanelCardLocator, location: target },
      { at: 0.70, locator: besidePanelCardLocator, location: target }, // pause — widened from 0.55
      { at: 1.00, locator: onPlayerPanelLocator, location: target }
    ]
  }
}

farawayAnimations
  .configure((move, context) => isMoveItemType(MaterialType.Region)(move) && isRegionToNonViewedPlayerZone(move as MoveItem, getViewPlayer(context)))
  .duration(1800)
  .trajectory((ctx, move) => pickTrajectory(ctx, move as MoveItem))

farawayAnimations
  .configure((move, context) => isMoveItemType(MaterialType.Sanctuary)(move) && isSanctuaryToNonViewedPlayerZone(move as MoveItem, getViewPlayer(context)))
  .duration(1800)
  .trajectory((ctx, move) => pickTrajectory(ctx, move as MoveItem))

/**
 * Reveal trajectory for a region rotation flip on a non-viewed player's line.
 * panel → left → pause → (rotate happens mid-flight) → pause → back to panel.
 */
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionLine) return false
    const player = move.location.player
    if (player === undefined || player === getViewPlayer(context)) return false
    const current = context.rules.material(MaterialType.Region).getItem(move.itemIndex)
    if (!current) return false
    // Reveal = same location, rotation changes (undefined → true or similar)
    return current.location.type === LocationType.PlayerRegionLine
      && current.location.player === player
      && current.location.rotation !== move.location.rotation
  })
  .duration(2200)
  .trajectory((_ctx, move) => {
    const m = move as MoveItem
    const target = toPanel(m.location.player as number)
    return {
      waypoints: [
        { at: 0.15, locator: besidePanelCardLocator, location: target }, // arrive from panel
        { at: 0.35, locator: besidePanelCardLocator, location: target }, // pause before flip
        { at: 0.65, locator: besidePanelCardLocator, location: target }, // pause after flip
        { at: 0.85, locator: besidePanelCardLocator, location: target }, // hold before return
        { at: 1.00, locator: onPlayerPanelLocator, location: target }
      ]
    }
  })
