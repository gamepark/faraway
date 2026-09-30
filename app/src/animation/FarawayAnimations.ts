import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { ItemContext, MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType, isMoveItemTypeAtOnce, isShuffle, isStartRule, MoveItem } from '@gamepark/rules-api'
import { besidePanelCardLocator, onPlayerPanelLocator } from '../locators/OnPlayerPanelLocator'
import { getViewPlayer } from '../locators/panelCoordinates'

/* ============================================================================
 * Faraway animations — overall structure
 *
 *   §2  Trajectory builders. Helper functions returning Trajectory objects.
 *       Most are panel-anchored — they surface a non-viewed player's card
 *       beside their panel for a beat, since their own zones are off-screen.
 *   §3  Region animations.
 *   §4  Sanctuary animations.
 *   §5  Generic durations: shuffle, low-stakes shifts, and the scoring-rule
 *       tempo. Last, so they never shadow the precise rules of §3 and §4.
 *
 * Single-player view note: the viewer only sees their own zone. Cards
 * belonging to other ("non-viewed") players are routed via their
 * PlayerPanel using OnPlayerPanelLocator / BesidePanelCardLocator so the
 * viewer can read what the opponent is doing without seeing their hidden
 * private zones.
 * ============================================================================ */

export const farawayAnimations = new MaterialGameAnimations()

// ----------------------------------------------------------------------------
// §2. Trajectory builders (panel-anchored choreographies)
// ----------------------------------------------------------------------------

/** Slide-in trajectory for a card drawn/placed in a non-viewed player's zone.
 *  The card surfaces left of the panel, rests there long enough to be read,
 *  then slides onto the panel. Used for region picks (river card is public). */
const pickTrajectory = (_context: ItemContext, move: MoveItem) => {
  const at = { player: move.location.player as number }
  return {
    waypoints: [
      { at: 0.25, locator: besidePanelCardLocator, location: at },
      { at: 0.70, locator: besidePanelCardLocator, location: at }, // read pause
      { at: 1.00, locator: onPlayerPanelLocator, location: at }
    ]
  }
}

/** Reveal-style trajectory: emerge from panel face-down → brief pause → flip
 *  → long read pause → return to panel face-up. Used for both region reveals
 *  during the end-of-turn phase and sanctuary plays from non-viewed players.
 *  ~50% of the timeline sits on the face-up read pause. */
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

/** Region put-back from a non-viewed player's hand to the deck (ChooseHandCards
 *  setup — players send 2 cards back to the deck after the initial deal).
 *  Anchors the card on the panel and lets the framework fly it to the deck.
 *  `rotation: false` keeps the card face-down throughout — without it the
 *  framework tweens away the rotateY(180deg) inherited from the hidden hand
 *  and the card flashes face-up mid-flight. */
const discardFromPanelTrajectory = (context: ItemContext, move: MoveItem) => {
  const item = context.rules.material(MaterialType.Region).getItem(move.itemIndex)
  const at = { player: item.location.player as number, rotation: false }
  return {
    waypoints: [
      { at: 0.00, locator: onPlayerPanelLocator, location: at }
    ]
  }
}

/** Face-down sanctuary draw to a non-viewed player. Nothing to read, so we
 *  skip the long read pause used by {@link pickTrajectory}. `rotation: false`
 *  keeps the card face-down throughout — without it the locator transforms
 *  drop the rotateY(180deg) and the card flashes face-up mid-flight. */
const sanctuaryDrawTrajectory = (_context: ItemContext, move: MoveItem) => {
  const faceDown = { player: move.location.player as number, rotation: false }
  return {
    waypoints: [
      { at: 1.00, locator: onPlayerPanelLocator, location: faceDown }
    ]
  }
}

/** Sanctuary sacrifice from a non-viewed player's line back to the deck.
 *  Their line is off-screen, so we surface the card beside their panel for a
 *  read beat before the framework flies it to the deck.
 *
 *  Elevation choreography: the framework's default parabolic arc would land
 *  the card on the deck from above. We ramp elevation back down to 0 before
 *  the end so the card stays flat for the final approach — slides under the
 *  top deck card instead of dropping from above. */
const sanctuarySacrificeFromPanelTrajectory = (context: ItemContext, move: MoveItem) => {
  const item = context.rules.material(MaterialType.Sanctuary).getItem(move.itemIndex)
  const at = { player: item.location.player as number }
  return {
    waypoints: [
      { at: 0.00, locator: onPlayerPanelLocator, location: at },
      { at: 0.15, locator: besidePanelCardLocator, location: at },
      { at: 0.40, locator: besidePanelCardLocator, location: at }, // "this is the sanctuary being sacrificed" beat
      { at: 0.80, elevation: 0 }                                   // flatten before landing
    ]
  }
}

/** Flat-landing trajectory for the viewed player's own sanctuary move to
 *  the deck (sacrifice or hand-discard).
 *
 *  Elevation-only waypoints — they live on the parent div's elevation arc
 *  and are filtered out of the child div's X/Y keyframe path, so the card
 *  keeps a single smooth CSS tween from source to destination (no
 *  intermediate keyframe = no easing discontinuity = no saccade). The flip
 *  is driven by the source/target rotateY difference (face-up → face-down
 *  for sanctuary-to-deck), tweened over the whole duration by the browser.
 *
 *   - at 0.30, elevation 8 → peak early, mid-air
 *   - at 0.50, elevation 0 → flat by half-way so the card slides under
 *                            the deck stack instead of dropping from above */
const flatLandingTrajectory = {
  waypoints: [
    { at: 0.30, elevation: 8 },
    { at: 0.50, elevation: 0 }
  ]
}

// ----------------------------------------------------------------------------
// §3. Region animations
// ----------------------------------------------------------------------------

// §3.a — Viewed player: explicit 800ms flip for region reveals during scoring
// so the user can actually see the turn over (default + 0.2s CSS transition
// reads as instant). Gated to the viewed player only: the framework renders
// hidden items only while they have an active animation (DynamicItemsDisplay),
// so giving non-viewed rotations a non-zero duration would briefly pop hidden
// cards into view.
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

// §3.b — Non-viewed player: end-of-turn reveal (RevealRegions rule). Card
// flips face-up so the viewer can see what the opponent played this turn —
// important narrative beat. Panel-anchored revealTrajectory, same as sanctuary
// plays from non-viewed players.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionLine) return false
    if (move.location.rotation !== true) return false
    if (context.rules.game.rule?.id !== RuleId.RevealRegions) return false
    const player = move.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .duration(2600)
  .trajectory((_ctx, move) => revealTrajectory(move as MoveItem))

// §3.c — Non-viewed player: any other region → line (placement face-down,
// HideRegionLine flip, scoring reveals). The line is hidden; the scoring
// bubble beside the panel (ScoringIndicator) carries the narration during
// scoring. Skip the card animation entirely.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionLine) return false
    const player = move.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .duration(0)

// §3.d — Non-viewed player: HideRegionLine's moveItemsAtOnce (untyped
// location). Skip entirely — same logic as §3.c.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemTypeAtOnce(MaterialType.Region)(move)) return false
    if (move.location.type !== undefined) return false
    const items = context.rules.material(MaterialType.Region).index(move.indexes).getItems()
    if (items.length === 0) return false
    const player = items[0].location.player
    if (!items.every(i => i.location.player === player)) return false
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .skip()

// §3.e — Non-viewed player: put-back from hand to deck (ChooseHandCards
// setup). Surface the card on the panel before flying it to the deck.
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

// §3.f — Non-viewed player: catch-all pick (river → hand or hand → line, the
// card identity is now public). pickTrajectory surfaces it beside the panel
// for a read beat before snapping onto the panel.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Region)(move)) return false
    if (move.location.type !== LocationType.PlayerRegionHand
      && move.location.type !== LocationType.PlayerRegionLine) return false
    const player = move.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .duration(1800)
  .trajectory((ctx, move) => pickTrajectory(ctx, move as MoveItem))

// §3.g — Beyond the Veil: non-viewed player takes a Spirit. Their Region line
// is hidden, so the Spirit surfaces beside their panel for a read beat before
// snapping onto it, like a region pick. The viewed player's Spirit simply
// slides under their Region card (default animation). Spirits flip together
// with their Region without any move of their own: they are child items of
// the Region (see SpiritCardDescription.isFlippedOnTable).
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Spirit)(move)) return false
    if (move.location.type !== LocationType.PlayerSpirit) return false
    const player = move.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .duration(1800)
  .trajectory((ctx, move) => pickTrajectory(ctx, move as MoveItem))

// ----------------------------------------------------------------------------
// §4. Sanctuary animations
// ----------------------------------------------------------------------------

// §4.a — Non-viewed player: sanctuary play (hand → line). Card identity is
// revealed at this moment — use revealTrajectory so the viewer can read it.
// MUST be registered before §4.c (otherwise the catch-all picks it up first).
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

// §4.b — Non-viewed player: hand-discard at end of PlaceSanctuary turn
// (PlayerSanctuaryHand → SanctuaryDeck). Both ends are off-screen so the
// viewer has nothing to see — skip entirely.
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

// §4.c — Non-viewed player: sacrifice from their line back to the deck
// (SacrificeSanctuaryRule). Their line is hidden, so we route via the panel.
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

// §4.d — Viewed player: any sanctuary move to the deck (sacrifice OR
// hand-discard). Source is visible, so no panel routing. We just flatten the
// arc's tail so the card glides under the deck stack instead of dropping from
// above and floating over neighbouring cards mid-flight.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Sanctuary)(move)) return false
    if (move.location.type !== LocationType.SanctuaryDeck) return false
    const item = context.rules.material(MaterialType.Sanctuary).getItem(move.itemIndex)
    if (item?.location.type !== LocationType.PlayerSanctuaryLine
      && item?.location.type !== LocationType.PlayerSanctuaryHand) return false
    const sourcePlayer = item.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && sourcePlayer !== undefined && sourcePlayer === viewed
  })
  .trajectory(flatLandingTrajectory)

// §4.e — Non-viewed player: catch-all sanctuary draw (deck → hand). Slides
// the face-down card onto the panel — short, no read pause needed.
farawayAnimations
  .configure((move, context) => {
    if (!isMoveItemType(MaterialType.Sanctuary)(move)) return false
    if (move.location.type !== LocationType.PlayerSanctuaryHand
      && move.location.type !== LocationType.PlayerSanctuaryLine) return false
    const player = move.location.player
    const viewed = getViewPlayer(context)
    return viewed !== undefined && player !== undefined && player !== viewed
  })
  .duration(350)
  .trajectory((ctx, move) => sanctuaryDrawTrajectory(ctx, move as MoveItem))

// ----------------------------------------------------------------------------
// §5. Generic durations
//
// Registered last on purpose: the animation API hands a move to the first
// configuration that matches it, so these broad rules must not shadow the
// precise, panel-anchored ones above. §4.b/c/d/e all cover sanctuary moves
// that the "sanctuary to/from deck or hand" rule below would otherwise catch.
// ----------------------------------------------------------------------------

// Region drift in the river — short snap, no need for an arc.
farawayAnimations
  .configure((move) => isMoveItemType(MaterialType.Region)(move) && move.location.type === LocationType.Region)
  .duration(200)

// Region to discard pile — slightly slower so the viewer sees the move.
farawayAnimations
  .configure((move) => isMoveItemType(MaterialType.Region)(move) && move.location.type === LocationType.RegionDiscard)
  .duration(500)

// Sanctuary moves to/from the deck or hand — fast default. Each specific
// sanctuary case (sacrifice, viewer's discard…) has its own rule in §4 above.
farawayAnimations
  .configure((move) => isMoveItemType(MaterialType.Sanctuary)(move)
    && (move.location.type === LocationType.SanctuaryDeck || move.location.type === LocationType.PlayerSanctuaryHand))
  .duration(300)

// Shuffles are pure state changes — no animation.
farawayAnimations
  .configure(isShuffle)
  .skip()

// Tempo between resolutions: each re-entry into ScoringRule (one per x tick,
// 7→0) pauses so the viewer can absorb the score that pops beside the panels
// before the next column's reveal kicks in. The wait sits on the StartRule
// itself, so all the score bubbles stay visible for its full duration (state —
// and therefore CurrentScoringX — only flips at the end of the BEFORE_MOVE
// animation). The next reveal then adds its own ~800ms before the new bubbles
// appear, so total quiet time between two bubble sets is roughly
// `duration + reveal duration`.
farawayAnimations
  .configure(move => isStartRule(move) && move.id === RuleId.Scoring)
  .duration(2500)
