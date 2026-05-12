import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType, isMoveItemTypeAtOnce, isShuffle, isStartRule, MaterialItem, MoveItem } from '@gamepark/rules-api'
import { besidePanelCardLocator, onPlayerPanelLocator } from '../locators/OnPlayerPanelLocator'
import { getViewPlayer } from '../locators/panelCoordinates'

export const farawayAnimations = new MaterialGameAnimations()

farawayAnimations.when()
  .move((move) => isMoveItemType(MaterialType.Region)(move) && move.location.type === LocationType.Region)
  .duration(0.5)

farawayAnimations.when()
  .move((move) => isMoveItemType(MaterialType.Region)(move) && move.location.type === LocationType.RegionDiscard)
  .duration(0.5)

// Sanctuary moves to deck/hand: a non-viewed player's *discard* (hand → deck at the
// end of their PlaceSanctuary turn) is a non-event for the viewer — both source and
// destination are off-screen — so we skip it. Sacrifices (line → deck during the
// SacrificeSanctuary rule) take a different source and fall through to the default
// duration below so they stay visible.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Sanctuary)(move)) return false
    if (move.location.type !== LocationType.SanctuaryDeck) return false
    const item = context.rules.material(MaterialType.Sanctuary).getItem(move.itemIndex)
    if (item?.location.type !== LocationType.PlayerSanctuaryHand) return false
    const sourcePlayer = item.location.player
    return sourcePlayer !== undefined && sourcePlayer !== getViewPlayer(context)
  })
  .duration(0)

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
 * Face-down sanctuary draw to a non-viewed player: nothing to read, so we skip the
 * long read-pause used by {@link pickTrajectory}. A brief beside-panel beat near the
 * end keeps the card readable as "a card was drawn" before it slides into the panel.
 *
 * Explicit `rotation: false` keeps the card face-down throughout — without it the
 * locator transforms drop the `rotateY(180deg)` and the card flashes face-up mid-flight.
 */
const sanctuaryDrawTrajectory = (_context: unknown, move: MoveItem) => {
  const faceDown = { player: move.location.player as number, rotation: false }
  return {
    waypoints: [
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

// Tempo between resolutions: each re-entry into ScoringRule (one per x tick, 7→0)
// pauses 1.5s so the viewer can absorb the score that pops beside the panels before
// the next column's reveal kicks in. Putting the wait on the RuleMove itself avoids
// adding any visible animation to the cards — the reveal/hide flips stay snappy via
// the catch-all duration(0) below, but the rule transition holds the frame.
farawayAnimations
  .configure(move => isStartRule(move) && move.id === RuleId.Scoring)
  .duration(1500)

// Region rotation on a non-viewed player's line (scoring reveal, HideRegionLine flip):
// no card animation. The viewer can't see the card art anyway; the score bubble we
// surface beside the player's panel (ScoringIndicator) carries the narration.

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

// Any region move into a non-viewed player's line — placement, rotation reveal, or
// HideRegionLine flip — has no visible card for the viewer (their line is hidden).
// Skip the animation entirely; the score bubble next to the player's panel
// (ScoringIndicator) carries the scoring narration.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionLine) return false
    const player = move.location.player
    return player !== undefined && player !== getViewPlayer(context)
  })
  .duration(0)

farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemTypeAtOnce(MaterialType.Region)(move)) return false
    if (move.location.type != undefined) return false
    const item = context.rules.material(MaterialType.Region).getItem(move.indexes[0])
    const player = item.location.player
    if (!context.rules.material(MaterialType.Region).index(move.indexes).getItems().every(i => i.location.player === item.location.player)) return false
    return player !== undefined && player !== getViewPlayer(context)
  })
  .skip()

farawayAnimations
  .configure((move, context) => isMoveItemType(MaterialType.Region)(move) && isRegionToNonViewedPlayerZone(move as MoveItem, getViewPlayer(context)))
  .duration(1800)
  .trajectory((ctx, move) => pickTrajectory(ctx, move as MoveItem))

farawayAnimations
  .configure((move, context) => isMoveItemType(MaterialType.Sanctuary)(move) && isSanctuaryToNonViewedPlayerZone(move as MoveItem, getViewPlayer(context)))
  .duration(700)
  .trajectory((ctx, move) => sanctuaryDrawTrajectory(ctx, move as MoveItem))
