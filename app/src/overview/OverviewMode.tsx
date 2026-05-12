import { css, keyframes } from '@emotion/react'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faTableCellsLarge } from '@fortawesome/free-solid-svg-icons/faTableCellsLarge'
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
import { FC, useCallback, useEffect, useState } from 'react'
import { RegionScorePointBubble } from '../locators/description/RegionScorePointBubble'
import { SanctuaryScorePointBubble } from '../locators/description/SanctuaryScorePointBubble'
import { RegionScoreX, RegionScoreY } from '../locators/RegionScorePointLocator'
import { currentlyResolvingCss, regionCardDescription } from '../material/RegionCardDescription'
import { sanctuaryCardDescription } from '../material/SanctuaryCardDescription'

/**
 * Adds an "Overview" toggle and a full-screen overlay grid that shows every player's
 * board side by side, using {@link MaterialComponent} for the cards and the same
 * {@link RegionScorePointBubble} / {@link SanctuaryScorePointBubble} components the
 * live game table uses for per-card scores. UI-only mode — no game-state mutation.
 * Clicking on a player's mini-board switches the in-game view to that player.
 */
export const OverviewMode: FC = () => {
  const [open, setOpen] = useState(false)

  // Esc closes the overlay so it doesn't trap the user.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // We render INSIDE the GameTable so the em-based scaling stays consistent. The
  // GameTable uses 3D transforms, so z-index alone won't lift us above the panels —
  // we lift the toggle and the overlay with translateZ() above the panels' 5em.
  return (
    <>
      <button
        type="button"
        css={[toggleButtonCss, open && toggleButtonActiveCss]}
        onClick={() => setOpen(o => !o)}
        aria-label="Vue d'ensemble"
        title="Vue d'ensemble"
      >
        <FontAwesomeIcon icon={open ? faXmark : faTableCellsLarge}/>
      </button>
      {open && <OverviewOverlay onClose={() => setOpen(false)}/>}
    </>
  )
}

const OverviewOverlay: FC<{ onClose: () => void }> = ({ onClose }) => {
  const players = usePlayers({ sortFromMe: true })

  return (
    <div css={overlayCss} onClick={onClose}>
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
        <span css={scorePillCss}>
          <FontAwesomeIcon icon={faStar} css={scoreIconCss}/>
          <span>{totalScore}</span>
        </span>
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
          // Same predicate as RegionCardDescription.getLocations: scored cards are the ones
          // ScoringRule has already passed (x > currentScoringX); once memory is forgotten,
          // the game is over and every card is scored.
          const showRegionScore = currentScoringX !== undefined ? x > currentScoringX : isOver
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

const toggleButtonCss = css`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  /* Panels sit at translateZ(5em); we go higher so we always paint on top. */
  transform: translateZ(50em);
  width: 2.4em;
  height: 2.4em;
  border-radius: 0.45em;
  border: 0.16em solid ${INK};
  background: ${CREAM};
  color: ${INK};
  font-size: 1.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.2em 0.4em rgba(0, 0, 0, 0.35);
  transition: filter 0.12s ease;

  &:hover { filter: brightness(1.06); }
`

const toggleButtonActiveCss = css`
  background: ${SUN};
  box-shadow: 0 0.2em 0.4em rgba(0, 0, 0, 0.35), 0 0 0.6em rgba(238, 184, 58, 0.6);
`

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`

const overlayCss = css`
  position: absolute;
  inset: 0;
  /* Lift above the panels (5em) so the overlay sits in front in 3D space. */
  transform: translateZ(40em);
  background: rgba(10, 14, 22, 0.88);
  /* Allow vertical scroll when too many players or too tall on a small viewport. */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4em 1em 1em;
  animation: ${fadeIn} 0.18s ease-out;
`

/**
 * Auto-fit cells around the natural region row width (~30em). On phones (<600px)
 * we lock to a single column so cards stay readable.
 */
const gridCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(32em, 1fr));
  grid-auto-rows: min-content;
  gap: 1em;
  margin: 0 auto;
  max-width: 100em;

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
