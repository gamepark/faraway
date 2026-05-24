import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { getColor, Region } from '@gamepark/faraway/cards/Region'
import { Sanctuary } from '@gamepark/faraway/cards/Sanctuary'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { LogDescription, MoveComponentContext, MovePlayedLogDescription, SetupLogDescription } from '@gamepark/react-game'
import { isMoveItemType, isStartRule, isStartSimultaneousRule, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { ExtensionsButtonLog } from './components/ExtensionsButtonLog'
import { PutBackCardLog } from './components/PutBackCardLog'
import { RegionMoveLog } from './components/RegionMoveLog'
import { RoundSeparatorLog, RoundSeparatorSetupLog } from './components/RoundSeparatorLog'
import { SanctuaryMoveLog } from './components/SanctuaryMoveLog'
import { ScoringStartLog } from './components/ScoringStartLog'
import {
  biomeColor,
  dramaticSeparatorCss,
  entryCss,
  entryCssForAccent,
  extensionsButtonRowCss,
  roundSeparatorCss,
  sacrificeEntryCss
} from './logStyles'

/* ==================================================================
 * FarawayLogs — maps every Faraway move to a journal entry.
 *
 * Each placement/pick entry is tinted with the matching biome colour
 * via its left ribbon (cf. entryCssForAccent in logStyles.ts) so a
 * quick glance at the journal reveals the biome distribution. To
 * compute the biome we replay the move on a structured-clone game
 * and read the resulting item's id — this also gives the mini-card
 * components a consistent post-move state.
 *
 * Silenced (intentionally): sanctuary deals, refill river, sanctuary
 * hand discard between rounds, shuffles, rotations, all transitions
 * already implied by the placement logs.
 * ================================================================== */
export class FarawayLogs implements LogDescription<MaterialMove> {
  getMovePlayedLogDescription(
    move: MaterialMove,
    context: MoveComponentContext<MaterialMove>
  ): MovePlayedLogDescription | undefined {

    /* ---------- System separators ---------- */
    if (isStartRule(move)) {
      // Scoring re-enters itself once per x (8 ticks). Emit a single
      // "Final scoring begins" line on the FIRST entry — detected by
      // the parent action move NOT being a startRule(Scoring) itself
      // (the first entry comes from HideRegionLine.onRuleStart instead).
      if (move.id === RuleId.Scoring) {
        const parentMove: any = context.action.move
        const isFirstEntry = !(isStartRule(parentMove) && parentMove.id === RuleId.Scoring)
        if (isFirstEntry) {
          return { Component: ScoringStartLog, depth: 0, css: dramaticSeparatorCss }
        }
      }
      return undefined
    }

    // "Round X / 8" — emitted at the start of every PlaceRegion phase.
    // Beginner mode never reaches this branch because FarawaySetup.start()
    // calls startSimultaneousRule(PlaceRegion) inside the setup itself
    // (no move event); beginner games get their "Round 1 / 8" header
    // from getSetupLogDescriptions instead. In non-beginner mode
    // ChooseHandCardsRule emits this move for round 1, and RefillRegionRule
    // for rounds 2-8 — both flow through the dispatcher here.
    if (isStartSimultaneousRule(move) && move.id === RuleId.PlaceRegion) {
      return { Component: RoundSeparatorLog, depth: 0, css: roundSeparatorCss }
    }

    /* ---------- Region moves ---------- */
    if (isMoveItemType(MaterialType.Region)(move)) {
      const dest = move.location.type
      // Setup: discard one card from starting hand back into the deck.
      // The card identity is private, so we can't read a biome — use
      // the generic violet ribbon entry style.
      if (dest === LocationType.RegionDeck) {
        return {
          Component: PutBackCardLog,
          player: (move as any).location?.player ?? context.action.playerId,
          depth: 0,
          css: entryCss
        }
      }
      // Pose (Hand → PlayerRegionLine) and Pick (river → Hand) share the
      // same biome-tinted entry style, only the component variant differs.
      // The same MoveItem(Region, dest=PlayerRegionLine) shape is also used
      // by RevealRegionCards: rotateItems(true) emits a MoveItem that keeps
      // the location identical and only sets `rotation: true`. Differentiate
      // by reading the PRE-move item — if it was already on PlayerRegionLine,
      // this is a reveal (the card flips face-up), not a placement.
      if (dest === LocationType.PlayerRegionLine || dest === LocationType.PlayerRegionHand) {
        const accent = computeRegionBiomeColor(context.game, move)
        const variant = dest === LocationType.PlayerRegionHand
          ? 'pick'
          : isRevealMove(context.game, move)
            ? 'reveal'
            : 'place'
        return {
          Component: (props) => <RegionMoveLog {...props} variant={variant}/>,
          player: move.location.player,
          depth: 0,
          css: entryCssForAccent(accent)
        }
      }
      return undefined
    }

    /* ---------- Sanctuary moves ---------- */
    if (isMoveItemType(MaterialType.Sanctuary)(move)) {
      const dest = move.location.type
      // Place: PlayerSanctuaryHand → PlayerSanctuaryLine
      if (dest === LocationType.PlayerSanctuaryLine) {
        const accent = computeSanctuaryBiomeColor(context.game, move)
        return {
          Component: (props) => <SanctuaryMoveLog {...props} variant="place"/>,
          player: move.location.player,
          depth: 0,
          css: entryCssForAccent(accent)
        }
      }
      // Sacrifice: PlayerSanctuaryLine → SanctuaryDeck (during scoring).
      // The hand-discard path between phases also lands on SanctuaryDeck,
      // but only from PlayerSanctuaryHand — we filter on the active rule.
      if (dest === LocationType.SanctuaryDeck && context.game.rule?.id === RuleId.SacrificeSanctuary) {
        return {
          Component: (props) => <SanctuaryMoveLog {...props} variant="sacrifice"/>,
          player: (move as any).location?.player ?? context.action.playerId,
          depth: 0,
          css: sacrificeEntryCss
        }
      }
      return undefined
    }

    return undefined
  }

  /** Top-of-journal entries, rendered BEFORE any move. Three slots,
   *  each conditionally emitted:
   *
   *   1. "Active extensions" button — only when at least one extension
   *      is in play. Clicking re-opens the framework's
   *      ExtensionInfoDialog via the module-level open() signal.
   *   2. "Mulligan" separator — only in non-beginner games, where the
   *      journal opens with put-back discards from ChooseHandCards
   *      and needs a context banner.
   *   3. "Round 1 / 8" separator — only in beginner games. In non-
   *      beginner games the dispatcher already emits the round 1
   *      separator on the post-mulligan startSimultaneousRule(PlaceRegion).
   *
   *  Beginner detection: in beginner mode FarawaySetup pre-deals 3
   *  region cards per player into PlayerRegionHand AND deals N+1 cards
   *  face-up into LocationType.Region. In non-beginner mode each player
   *  gets 5 cards in hand and the river stays empty until refill.
   *  Counting the river is the most reliable cue. */
  getSetupLogDescriptions(game: MaterialGame): SetupLogDescription[] {
    // Always emit the extensions button — the component itself reads
    // useExtensionPopups() (which derives from the live useRules state)
    // and renders null when no extension is active. This avoids the
    // setup-time detection being out of sync with the live state and
    // keeps a single source of truth (the hook). Beginner-mode round
    // header is computed from the setup game state (river cards present
    // = beginner setup), since that one doesn't change post-setup.
    const rules = new FarawayRules(game)
    const beginner = rules.material(MaterialType.Region).location(LocationType.Region).length > 0

    const entries: SetupLogDescription[] = [
      { Component: ExtensionsButtonLog, css: extensionsButtonRowCss }
    ]
    if (beginner) {
      entries.push({ Component: RoundSeparatorSetupLog, css: roundSeparatorCss })
    }
    return entries
  }
}

/** Replay the region move on a cloned game so we can read the
 *  post-move item.id (hide strategies on the source location don't
 *  matter here — the rules engine has full visibility internally).
 *  Returns the biome accent colour, falling back to the soft ink
 *  default when the item can't be resolved (defensive fallback only,
 *  shouldn't happen on a real player move). */
function computeRegionBiomeColor(game: any, move: any): string {
  try {
    const rules = new FarawayRules(structuredClone(game))
    rules.play(move)
    const item = rules.material(MaterialType.Region).getItem<Region>(move.itemIndex)
    if (item?.id === undefined) return biomeColor(undefined)
    return biomeColor(getColor(item.id))
  } catch {
    return biomeColor(undefined)
  }
}

/** A region move is a "reveal" when the source AND destination location
 *  are both PlayerRegionLine — only the rotation changes. RevealRegionCards
 *  emits exactly that pattern via Material.rotateItems(true). Placement
 *  moves come from PlayerRegionHand, so reading the PRE-move source is
 *  enough to tell them apart. */
function isRevealMove(game: any, move: any): boolean {
  try {
    const rules = new FarawayRules(structuredClone(game))
    const sourceLocation = rules.material(MaterialType.Region).getItem(move.itemIndex)?.location
    return sourceLocation?.type === LocationType.PlayerRegionLine
  } catch {
    return false
  }
}

/** Same idea for sanctuaries — getColor accepts both Region and
 *  Sanctuary enums (their numeric encoding is identical). */
function computeSanctuaryBiomeColor(game: any, move: any): string {
  try {
    const rules = new FarawayRules(structuredClone(game))
    rules.play(move)
    const item = rules.material(MaterialType.Sanctuary).getItem<Sanctuary>(move.itemIndex)
    if (item?.id === undefined) return biomeColor(undefined)
    return biomeColor(getColor(item.id))
  } catch {
    return biomeColor(undefined)
  }
}
