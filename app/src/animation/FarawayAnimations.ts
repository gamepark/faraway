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
 *
 * Used for region picks (the river card is public, we want to see what was picked).
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

/**
 * Same shape as {@link pickTrajectory} but keeps the card face-down throughout — used for
 * sanctuary draws, where the card identity is secret. Without an explicit `rotation: false`
 * the locator transforms drop the `rotateY(180deg)` and the card flashes face-up mid-flight.
 */
const sanctuaryDrawTrajectory = (_context: unknown, move: MoveItem) => {
  const faceDown = { player: move.location.player as number, rotation: false }
  return {
    waypoints: [
      { at: 0.25, locator: besidePanelCardLocator, location: faceDown },
      { at: 0.70, locator: besidePanelCardLocator, location: faceDown },
      { at: 1.00, locator: onPlayerPanelLocator, location: faceDown }
    ]
  }
}

/**
 * Reveal-style trajectory: emerge from panel face-down → brief pause → flip → long read pause → return to panel face-up.
 * Used for both region rotation reveals and sanctuary plays from a non-viewed player.
 *
 * Most of the timeline (~50%) sits on the face-up read pause so the viewer has time to read the card.
 */
const revealTrajectory = (move: MoveItem) => {
  const player = move.location.player as number
  const faceDown = { player, rotation: false }
  const faceUp = { player, rotation: true }
  return {
    waypoints: [
      { at: 0.00, locator: onPlayerPanelLocator, location: faceDown },   // emerge from panel, hidden
      { at: 0.12, locator: besidePanelCardLocator, location: faceDown }, // scaled out, still face-down
      { at: 0.22, locator: besidePanelCardLocator, location: faceDown }, // brief face-down pause
      { at: 0.32, locator: besidePanelCardLocator, location: faceUp },   // flip completed
      { at: 0.75, locator: besidePanelCardLocator, location: faceUp },   // read pause (face up, visible)
      { at: 1.00, locator: onPlayerPanelLocator, location: faceUp }      // scale back into panel
    ]
  }
}

/**
 * Region reveal: same location, rotation changes (undefined → true).
 *
 * Must be registered BEFORE the no-animation/pickTrajectory rules below — the framework
 * picks the FIRST matching builder, and those broader rules also match PlayerRegionLine moves.
 */
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionLine) return false
    const player = move.location.player
    if (player === undefined || player === getViewPlayer(context)) return false
    const current = context.rules.material(MaterialType.Region).getItem(move.itemIndex)
    if (!current) return false
    return current.location.type === LocationType.PlayerRegionLine
      && current.location.player === player
      && current.location.rotation !== move.location.rotation
  })
  .duration(2600)
  .trajectory((_ctx, move) => revealTrajectory(move as MoveItem))

/**
 * Sanctuary play: a non-viewed player moves a sanctuary from their hand to their line.
 * The card identity is revealed at this moment, so we use the same panel-flip animation
 * as a region reveal so the viewer can read what was played.
 *
 * Must be registered BEFORE the sanctuary pickTrajectory rule below.
 */
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Sanctuary)(move)) return false
    if (move.location.type !== LocationType.PlayerSanctuaryLine) return false
    const player = move.location.player
    return player !== undefined && player !== getViewPlayer(context)
  })
  .duration(2600)
  .trajectory((_ctx, move) => revealTrajectory(move as MoveItem))

// A non-viewed player placing a region from hand to their line is invisible to us
// (both the source hand and the destination line are hidden), so the animation has
// nothing meaningful to show — skip it entirely. Reveal moves are caught by the
// rule above; this only catches non-reveal placements.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionLine) return false
    const player = move.location.player
    return player !== undefined && player !== getViewPlayer(context)
  })
  .duration(0)

farawayAnimations
  .configure((move, context) => isMoveItemType(MaterialType.Region)(move) && isRegionToNonViewedPlayerZone(move as MoveItem, getViewPlayer(context)))
  .duration(1800)
  .trajectory((ctx, move) => pickTrajectory(ctx, move as MoveItem))

farawayAnimations
  .configure((move, context) => isMoveItemType(MaterialType.Sanctuary)(move) && isSanctuaryToNonViewedPlayerZone(move as MoveItem, getViewPlayer(context)))
  .duration(1800)
  .trajectory((ctx, move) => sanctuaryDrawTrajectory(ctx, move as MoveItem))
