import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { ItemContext, MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType, isMoveItemTypeAtOnce, isShuffle, isStartRule, MaterialItem, MoveItem } from '@gamepark/rules-api'
import { besidePanelCardLocator, onPlayerPanelLocator } from '../locators/OnPlayerPanelLocator'
import { getViewPlayer } from '../locators/panelCoordinates'

export const farawayAnimations = new MaterialGameAnimations()

farawayAnimations.when()
  .move((move) => isMoveItemType(MaterialType.Region)(move) && move.location.type === LocationType.Region)
  .duration(0.2)

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
    const viewed = getViewPlayer(context)
    return viewed !== undefined && sourcePlayer !== undefined && sourcePlayer !== viewed
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
  viewed !== undefined
  && isMoveItemType(MaterialType.Region)(move)
  && (move.location.type === LocationType.PlayerRegionHand || move.location.type === LocationType.PlayerRegionLine)
  && move.location.player !== undefined
  && move.location.player !== viewed

const isSanctuaryToNonViewedPlayerZone = (move: MoveItem, viewed: number | undefined): boolean =>
  viewed !== undefined
  && isMoveItemType(MaterialType.Sanctuary)(move)
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
 * "Discard from panel" trajectory: the source hand of a non-viewed player is off-screen,
 * so we anchor the card on the player's panel as the starting point, then let the framework
 * fly it straight to the deck.
 *
 * Explicit `rotation: false` keeps the card face-down throughout. Without it the framework
 * tweens away the rotateY(180deg) inherited from the hidden hand → the card flashes face-up
 * mid-flight before snapping face-down on the deck.
 */
const discardFromPanelTrajectory = (context: ItemContext, move: MoveItem) => {
  const item = context.rules.material(MaterialType.Region).getItem(move.itemIndex)
  const sourcePlayer = item.location.player as number
  const at = { player: sourcePlayer, rotation: false }
  return {
    waypoints: [
      { at: 0.00, locator: onPlayerPanelLocator, location: at }
    ]
  }
}

/**
 * Sanctuary sacrifice from a non-viewed player's line back to the deck. The viewer can't
 * see their line, so we surface the card beside their panel (same shape as
 * {@link discardFromPanelTrajectory}) before the framework flies it to the deck.
 */
const sanctuarySacrificeFromPanelTrajectory = (context: ItemContext, move: MoveItem) => {
  const item = context.rules.material(MaterialType.Sanctuary).getItem(move.itemIndex)
  const sourcePlayer = item.location.player as number
  const at = { player: sourcePlayer }
  return {
    waypoints: [
      { at: 0.00, locator: onPlayerPanelLocator, location: at },
      { at: 0.15, locator: besidePanelCardLocator, location: at },
      { at: 0.40, locator: besidePanelCardLocator, location: at } // "this is the sanctuary being sacrificed" beat
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
// pauses so the viewer can absorb the score that pops beside the panels before the next
// column's reveal kicks in. The wait sits on the StartRule itself, so all the score
// bubbles stay visible for its full duration (state — and therefore CurrentScoringX —
// only flips at the end of the BEFORE_MOVE animation). The next reveal then adds its
// own ~800ms before the new bubbles appear, so total quiet time between two bubble
// sets is roughly `duration + reveal duration`.
//
// Uses the legacy `.when()` API on purpose: it gates the duration on
// `AnimationStep.BEFORE_MOVE` only (see AnimationConfig.getDuration), so undo doesn't
// inherit the 2.5s wait. The new `.configure().duration()` would apply to every step
// for non-ItemMove kinds, freezing the UI for 2.5s on every undo step too.
farawayAnimations.when()
  .move(move => isStartRule(move) && move.id === RuleId.Scoring)
  .duration(2.5)

// Region reveal during scoring on the VIEWED player's line: a card already on the line
// flips from face-down to face-up. Explicit 800ms flip so the user can actually see the
// turn over — without this, the framework's default plus the 0.2s CSS transition reads
// as instant. Must stay gated to the viewed player: the framework renders hidden items
// only while they have an active animation (DynamicItemsDisplay), so giving non-viewed
// rotations a non-zero duration would make the hidden cards briefly pop into view. The
// `.duration(0)` catch-all below keeps non-viewed reveals invisible.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionLine) return false
    if (move.location.rotation !== true) return false
    if (move.location.player !== getViewPlayer(context)) return false
    const item = context.rules.material(MaterialType.Region).getItem(move.itemIndex)
    if (item?.location.type !== LocationType.PlayerRegionLine) return false
    return item.location.rotation !== true
  })
  .duration(800)

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
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .duration(2600)
  .trajectory((_ctx, move) => revealTrajectory(move as MoveItem))

// Region placements on a non-viewed player's line (and any non-reveal flip, like
// HideRegionLine) have no visible card for the viewer — the line is hidden.
// Skip those entirely; the score bubble beside the panel carries the narration.
// Reveals (rotation: true) DON'T fall through here: they're the moment the viewer
// finally gets to see the card, so we want a real animation for them — handled
// by a separate rule below via revealTrajectory.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionLine) return false
    if (move.location.rotation === true) return false
    const player = move.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .duration(0)

// Region reveal on a non-viewed player's line: card flips from face-down to face-up.
// We surface it via the panel for a reveal-style animation so the viewer can read
// what was just revealed.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionLine) return false
    if (move.location.rotation !== true) return false
    const player = move.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .duration(2600)
  .trajectory((_ctx, move) => revealTrajectory(move as MoveItem))

farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemTypeAtOnce(MaterialType.Region)(move)) return false
    if (move.location.type != undefined) return false
    const item = context.rules.material(MaterialType.Region).getItem(move.indexes[0])
    const player = item.location.player
    if (!context.rules.material(MaterialType.Region).index(move.indexes).getItems().every(i => i.location.player === item.location.player)) return false
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .skip()

// Region put-back from a non-viewed player's hand to the deck (ChooseHandCardsRule at game start —
// players send 2 cards back to the deck after the initial deal). The source hand is off-screen for
// the viewer, so we anchor the card on the player's panel before letting it fly to the deck.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.RegionDeck) return false
    const item = context.rules.material(MaterialType.Region).getItem(move.itemIndex)
    if (item?.location.type !== LocationType.PlayerRegionHand) return false
    const sourcePlayer = item.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && sourcePlayer !== undefined && sourcePlayer !== viewed
  })
  .duration(500)
  .trajectory((ctx, move) => discardFromPanelTrajectory(ctx, move as MoveItem))

farawayAnimations
  .configure((move, context) => isMoveItemType(MaterialType.Region)(move) && isRegionToNonViewedPlayerZone(move as MoveItem, getViewPlayer(context)))
  .duration(1800)
  .trajectory((ctx, move) => pickTrajectory(ctx, move as MoveItem))

farawayAnimations
  .configure((move, context) => isMoveItemType(MaterialType.Sanctuary)(move) && isSanctuaryToNonViewedPlayerZone(move as MoveItem, getViewPlayer(context)))
  .duration(700)
  .trajectory((ctx, move) => sanctuaryDrawTrajectory(ctx, move as MoveItem))

// Sanctuary sacrifice from a non-viewed player's line back to the deck (SacrificeSanctuaryRule).
// The viewer can't see the player's sanctuary line, so without this the card would just fly out
// of an invisible spot toward the deck. We route it via the player's panel so the viewer sees
// where it's coming from.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Sanctuary)(move)) return false
    if (move.location.type !== LocationType.SanctuaryDeck) return false
    const item = context.rules.material(MaterialType.Sanctuary).getItem(move.itemIndex)
    if (item?.location.type !== LocationType.PlayerSanctuaryLine) return false
    const sourcePlayer = item.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && sourcePlayer !== undefined && sourcePlayer !== viewed
  })
  .duration(1200)
  .trajectory((ctx, move) => sanctuarySacrificeFromPanelTrajectory(ctx, move as MoveItem))
