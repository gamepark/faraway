import { css, keyframes } from '@emotion/react'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Region } from '@gamepark/faraway/cards/Region'
import { Sanctuary } from '@gamepark/faraway/cards/Sanctuary'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { ScoreHelper } from '@gamepark/faraway/rules/helper/ScoreHelper'
import { Memory } from '@gamepark/faraway/rules/Memory'
import { Player } from '@gamepark/react-client'
import { MaterialComponent, usePlay, usePlayerName, usePlayers, useRules } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { CSSProperties, FC, MouseEvent, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { RegionScorePointBubble } from '../locators/description/RegionScorePointBubble'
import { SanctuaryScorePointBubble } from '../locators/description/SanctuaryScorePointBubble'
import { RegionScoreX, RegionScoreY } from '../locators/RegionScorePointLocator'
import { currentlyResolvingCss, isResolvedRegion, regionCardDescription } from '../material/RegionCardDescription'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'

/**
 * Single self-contained piece of the overview feature:
 *   - the toggle button (rendered in place — PlayerPanels positions it via `style`)
 *   - the full-screen overlay (portaled to <body> when open)
 *
 * Mounted once from PlayerPanels — the `open` state is local useState, no context
 * needed since the button and overlay live in the same component instance.
 */
export const OverviewMode: FC<{ style?: CSSProperties }> = ({ style }) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const label = t('overview.toggle', "Vue d'ensemble")

  // Esc closes the overlay so it doesn't trap the user.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const onToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setOpen(o => !o)
  }
  const onClose = useCallback(() => setOpen(false), [])

  return (
    <>
      <button type="button" css={toggleButtonCss} style={style} onClick={onToggle} aria-label={label} title={label}>
        <span className="halo"/>
        <span className="peg tl"/>
        <span className="peg tr"/>
        <span className="peg bl"/>
        <span className="peg br"/>
        <span className="body" css={toggleBodyCss(open)}>
          <PanelsGlyph/>
        </span>
      </button>
      {open && createPortal(<OverviewOverlay onClose={onClose}/>, document.body)}
    </>
  )
}

const PanelsGlyph: FC = () => (
  <svg viewBox="0 0 24 24" css={glyphCss} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3"    width="18" height="5" rx="1.2"/>
    <rect x="3" y="9.5"  width="18" height="5" rx="1.2"/>
    <rect x="3" y="16"   width="18" height="5" rx="1.2"/>
    <circle cx="6.5" cy="5.5"  r="0.95" fill="currentColor" stroke="none"/>
    <circle cx="6.5" cy="12"   r="0.95" fill="currentColor" stroke="none"/>
    <circle cx="6.5" cy="18.5" r="0.95" fill="currentColor" stroke="none"/>
  </svg>
)

const OverviewOverlay: FC<{ onClose: () => void }> = ({ onClose }) => {
  const players = usePlayers({ sortFromMe: true })

  return (
    <div css={overlayCss} onClick={onClose}>
      <button
        type="button"
        css={[toggleButtonCss, closeButtonPositionCss]}
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Fermer la vue d'ensemble"
        title="Fermer"
      >
        <span className="halo"/>
        <span className="peg tl"/>
        <span className="peg tr"/>
        <span className="peg bl"/>
        <span className="peg br"/>
        <span className="body" css={toggleBodyCss(false)}>
          <FontAwesomeIcon icon={faXmark} css={glyphCss}/>
        </span>
      </button>
      <div css={gridCss} onClick={e => e.stopPropagation()}>
        {players.map(player => (
          <PlayerCell key={player.id} player={player} onSwitched={onClose}/>
        ))}
      </div>
    </div>
  )
}

const PlayerCell: FC<{ player: Player; onSwitched: () => void }> = ({ player, onSwitched }) => {
  const rules = useRules<FarawayRules>()!
  const name = usePlayerName(player.id)
  const play = usePlay()
  const viewedPlayer = (rules as unknown as { game: { view?: PlayerId } }).game.view
  const isViewed = viewedPlayer === player.id

  const onClick = useCallback(() => {
    play(MaterialMoveBuilder.changeView(player.id), { transient: true })
    onSwitched()
  }, [play, player.id, onSwitched])

  // ScoringRule iterates from x=7 down to x=0; cards at x > currentScoringX are resolved,
  // x === currentScoringX is the one being resolved. Once memory is forgotten, the game
  // is over and every card has been resolved.
  const currentScoringX = rules.remind<number | undefined>(Memory.CurrentScoringX)
  const isOver = rules.isOver()

  // Region line indexed by x slot (0..7).
  type RegionEntry = { index: number; id?: Region; rotation?: boolean }
  const regionsByX = new Map<number, RegionEntry>()
  for (const index of rules.material(MaterialType.Region).location(LocationType.PlayerRegionLine).player(player.id).getIndexes()) {
    const item = rules.material(MaterialType.Region).getItem<Region>(index)
    if (item.location.x === undefined) continue
    regionsByX.set(item.location.x, { index, id: item.id, rotation: item.location.rotation as boolean | undefined })
  }

  const sanctuaryEntries = rules
    .material(MaterialType.Sanctuary)
    .location(LocationType.PlayerSanctuaryLine)
    .player(player.id)
    .getIndexes()
    .map(index => ({ index, id: rules.material(MaterialType.Sanctuary).getItem(index).id as Sanctuary | undefined }))

  // Running total — meaningful from the scoring phase onwards. ScoreHelper just sums
  // each quest's getTotalScore against the current state, so it works at any moment.
  const totalScore = new ScoreHelper(rules.game, player.id).score

  return (
    <button
      type="button"
      css={[cellCss, isViewed && cellViewedCss]}
      onClick={onClick}
      aria-label={`Voir ${name ?? `joueur ${player.id}`}`}
    >
      <div css={cellHeaderCss}>
        <span css={cellNameCss}>{name ?? `Joueur ${player.id}`}</span>
        {(currentScoringX !== undefined || isOver) && (
          <span css={scorePillCss}>
            <FontAwesomeIcon icon={faStar} css={scoreIconCss}/>
            <span>{totalScore}</span>
          </span>
        )}
      </div>

      <div css={regionGridCss}>
        {Array.from({ length: 8 }).map((_, x) => {
          const entry = regionsByX.get(x)
          if (!entry) return <div key={x} css={emptyRegionCss}/>
          const resolving = currentScoringX === x
          // A region is shown face-down when its id is hidden to us (opponents) OR
          // when it sits face-down on the line (rotation === false). MaterialComponent
          // alone doesn't flip the card; we render the back image directly instead.
          const faceDown = entry.id === undefined || entry.rotation === false
          // Same predicate as the game table (RegionCardDescription.getLocations) so
          // the overview bubble appears in sync — not one tick later.
          const regionItem = rules.material(MaterialType.Region).getItem<Region>(entry.index)
          const showRegionScore = isResolvedRegion(regionItem, { rules })
          // Match the locator's per-card bubble position (RegionScorePointLocator).
          const bubbleX = entry.id !== undefined ? RegionScoreX[entry.id] ?? 60 : 60
          const bubbleY = entry.id !== undefined ? RegionScoreY[entry.id] ?? 35 : 35
          return (
            <div key={x} css={[cardWrapperCss, resolving && currentlyResolvingCss]}>
              {faceDown ? (
                <div css={cardBackCss(regionCardDescription.width, regionCardDescription.height)}
                     style={{ backgroundImage: `url(${regionCardDescription.backImage})` }}/>
              ) : (
                <>
                  <MaterialComponent type={MaterialType.Region} itemId={entry.id}/>
                  {showRegionScore && (
                    <div
                      css={scoreBubbleSlotCss}
                      style={{ left: `${bubbleX}%`, top: `${bubbleY}%` }}
                    >
                      <RegionScorePointBubble
                        location={{ type: LocationType.RegionScorePoints, parent: entry.index }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      <div css={sanctuaryRowCss}>
        {sanctuaryEntries.map(entry => {
          const faceDown = entry.id === undefined
          // Sanctuaries are scored only after every region tick has run — i.e. when
          // the game is over. Showing earlier would display a running number that
          // doesn't yet account for partial resolution.
          const showSanctuaryScore = rules.isOver()
          return (
            <div key={entry.index} css={cardWrapperCss}>
              {faceDown ? (
                <div css={cardBackCss(sanctuaryCardDescription.width, sanctuaryCardDescription.height)}
                     style={{ backgroundImage: `url(${sanctuaryCardDescription.backImage})` }}/>
              ) : (
                <>
                  <MaterialComponent type={MaterialType.Sanctuary} itemId={entry.id}/>
                  {showSanctuaryScore && (
                    <div css={[scoreBubbleSlotCss, sanctuaryBubbleSlotCss]}>
                      <SanctuaryScorePointBubble
                        location={{ type: LocationType.SanctuaryScorePoints, parent: entry.index }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </button>
  )
}

// ---------- Styles ----------
const INK = '#1a2638'
const CREAM = '#f7ecd0'
const SUN = '#eeb83a'

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`

// ----- Toggle button (in-place, positioned by PlayerPanels via style) -----
// Same visual language as FarawayMenuButton: cream body, ink border, 4 corner
// gold pegs. The glyph is a stack of mini-panels to hint at the overlay content.
const toggleButtonCss = css`
  position: absolute;
  /* Matches the in-game FarawayMenuButton dimensions so both affordances feel
     equally weighted on screen. */
  width: 2em;
  height: 2em;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
  pointer-events: auto;
  transform: translateZ(5em);
  transform-style: preserve-3d;

  /* Halo kept in the JSX for layout stability but never shown — the hover
     uses a peg-slide animation + a body scale instead of a yellow glow. */
  .halo { display: none; }

  .peg {
    position: absolute;
    width: 0.85em;
    height: 0.85em;
    background: ${SUN};
    border: 0.14em solid ${INK};
    border-radius: 50%;
    transform: translateZ(-0.01em);
  }
  .peg.tl { top: -0.25em; left: -0.25em; right: auto; bottom: auto; }
  .peg.tr { top: -0.25em; right: -0.25em; left: auto; bottom: auto; }
  .peg.bl { bottom: -0.25em; left: -0.25em; right: auto; top: auto; }
  .peg.br { bottom: -0.25em; right: -0.25em; left: auto; top: auto; }

  .peg, .body {
    transition: top 0.18s ease, right 0.18s ease, bottom 0.18s ease, left 0.18s ease,
                transform 0.18s cubic-bezier(.3, 1.4, .4, 1),
                box-shadow 0.14s ease, filter 0.14s ease;
  }

  &:hover .body {
    transform: translateZ(0.01em) scale(1.1);
    filter: brightness(1.04);
  }

  &:hover .peg.tl {
    top: -0.4em;
    left: 50%;
    transform: translate(-50%, 0) translateZ(-0.01em);
  }
  &:hover .peg.tr {
    top: 50%;
    right: -0.4em;
    transform: translate(0, -50%) translateZ(-0.01em);
  }
  &:hover .peg.br {
    bottom: -0.4em;
    right: 50%;
    transform: translate(50%, 0) translateZ(-0.01em);
  }
  &:hover .peg.bl {
    bottom: 50%;
    left: -0.4em;
    transform: translate(0, 50%) translateZ(-0.01em);
  }

  &:active .body {
    transform: translateZ(0.01em) scale(0.96);
    box-shadow: 0 0.08em 0.2em rgba(26, 38, 56, 0.35);
  }
`

const toggleBodyCss = (open: boolean) => css`
  position: absolute;
  inset: 0;
  border-radius: 0.3em;
  background: ${open
    ? `linear-gradient(180deg, #ffe39a 0%, ${SUN} 100%)`
    : `linear-gradient(180deg, #fdf3d0 0%, ${CREAM} 100%)`};
  border: 0.18em solid ${INK};
  display: flex;
  align-items: center;
  justify-content: center;
  /* Keep the body in front of pegs in 3D space (Firefox respects Z over
     z-index in preserve-3d contexts — see ItemMenuButton). */
  transform: translateZ(0.01em);
  box-shadow:
    0 0.2em 0.4em rgba(0, 0, 0, 0.4),
    inset 0 -0.14em 0.25em rgba(184, 138, 26, 0.22),
    inset 0 0.14em 0.2em rgba(255, 255, 255, 0.4);
`

const glyphCss = css`
  width: 1.4em;
  height: 1.4em;
  color: ${INK};
`

// ----- Overlay (portaled to body) -----

/**
 * Top-right close button. Re-uses the toggle button's visual language (cream
 * body, ink border, 4 corner gold pegs) so opening and closing share the same
 * affordance. Only the positioning is overridden here.
 */
const closeButtonPositionCss = css`
  position: fixed;
  top: 0.6em;
  right: 0.6em;
  z-index: 1001;
`

const overlayCss = css`
  position: fixed;
  inset: 0;
  z-index: 1000;
  /* Portal escape from GameTable means we lose the table's scaled em base.
     A viewport-relative font-size keeps the cards and grid sized to the screen
     instead of falling back to the 16px browser default. */
  font-size: clamp(14px, 1.9vmin, 26px);
  background: rgba(10, 14, 22, 0.88);
  /* Allow vertical scroll when too many players or too tall on a small viewport. */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 3.5em 1em 1em;
  animation: ${fadeIn} 0.18s ease-out;
`

/**
 * Two columns of player cells. Falls back to a single column on narrow screens
 * so cards stay readable on mobile.
 */
const gridCss = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: min-content;
  gap: 1em;
  margin: 0 auto;
  max-width: 120em;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const cellCss = css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  padding: 0.7em 0.9em;
  background: rgba(0, 0, 0, 0.4);
  border: 0.14em solid rgba(255, 255, 255, 0.08);
  border-radius: 0.6em;
  color: ${CREAM};
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition: border-color 0.15s ease, transform 0.1s ease;
  min-width: 0;
  /* Establishes a query container so the card grids scale to whatever width the
     cell ends up with (auto-fit grid + variable player count). */
  container-type: inline-size;

  &:hover {
    border-color: ${SUN};
    transform: translateY(-2px);
  }
`

const cellViewedCss = css`
  border-color: ${SUN};
  box-shadow: 0 0 0.6em rgba(238, 184, 58, 0.45);
`

const cellHeaderCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6em;
  flex-shrink: 0;
`

const cellNameCss = css`
  font-weight: 700;
  font-size: 1em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
  min-width: 0;
`

const scorePillCss = css`
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  background: ${SUN};
  color: ${INK};
  font-weight: 800;
  font-size: 0.95em;
  padding: 0.15em 0.6em;
  border-radius: 0.3em;
  border: 0.12em solid ${INK};
`

const scoreIconCss = css`color: ${INK};`

/**
 * MaterialComponent renders cards at their description's native em size (region 7×7em).
 * We scale via container-query font-size: 1cqi = 1 % of the cell's inline width, so the
 * 4-card row fills the cell whatever its width. clamp() guards against degenerate
 * sizes on tiny / huge containers.
 *
 * Math: cell content ≈ cellW − padding(~1.6em) − 3·gap(0.4em). Each card = content/4.
 * font-size = card / 7em ≈ (cellW − 2.8em) / 28.
 */
const regionGridCss = css`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-auto-rows: auto;
  gap: 0.4em;
  justify-content: start;
  font-size: clamp(0.4em, calc((100cqi - 2.8em) / 28), 1.5em);
`

/** Same scaling formula as the region row so sanctuaries grow with the cell too. */
const sanctuaryRowCss = css`
  display: flex;
  gap: 0.3em;
  flex-shrink: 0;
  flex-wrap: wrap;
  font-size: clamp(0.4em, calc((100cqi - 2.8em) / 28), 1.5em);
`

const cardWrapperCss = css`
  position: relative;
  /* Positioning context for the per-card score bubble. */
`

const emptyRegionCss = css`
  width: 7em;
  height: 7em;
  border-radius: 0.4em;
  background: rgba(255, 255, 255, 0.04);
`

/** Same em footprint as MaterialComponent (description.getSize) so the layout doesn't
 *  shift when a card flips between face-up and face-down. */
const cardBackCss = (width: number, height: number) => css`
  width: ${width}em;
  height: ${height}em;
  background-size: cover;
  background-position: center;
  border-radius: 0.4em;
  box-shadow: 0 0.15em 0.3em rgba(0, 0, 0, 0.4);
`

/**
 * 2.2em × 2.2em matches RegionScorePointDescription's size. Centered on the (x%, y%)
 * point set by RegionScorePointLocator (or the sanctuary's fixed 50/45).
 */
const scoreBubbleSlotCss = css`
  position: absolute;
  width: 2.2em;
  height: 2.2em;
  transform: translate(-50%, -50%);
  pointer-events: none;
`

const sanctuaryBubbleSlotCss = css`
  /* Sanctuary score points sit at the locator's fixed 50% / 45% on the card. */
  left: 50%;
  top: 45%;
`
