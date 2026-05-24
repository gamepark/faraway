import { css, Interpolation, Theme } from '@emotion/react'
import { Color } from '@gamepark/faraway/cards/Color'
import { linkButtonCss } from '@gamepark/react-game'

const ink = '#3a1f5c'
const inkSoft = '#6a4f8c'
const orange = '#e87a3a'
const orangeDeep = '#c45f24'
const forest = '#4f7a40'
const river = '#3e6991'
const desert = '#d4a428'
const city = '#a83838'
const gray = '#7d8da0'

/** Map a Faraway biome enum to the matching rulebook ink. Used by the
 *  log dispatcher to colour each entry's left border ribbon. */
export const biomeColor = (color: Color | undefined): string => {
  switch (color) {
    case Color.Red:    return city
    case Color.Green:  return forest
    case Color.Blue:   return river
    case Color.Yellow: return desert
    case Color.Gray:   return gray
    default:           return inkSoft
  }
}

/** Base style applied via theme.journal.historyEntry to EVERY log row.
 *  Resets the framework's dark pill default to a paper-tinted "billet"
 *  with a thin ribbon stripe on the left. No font-size override here —
 *  the framework wraps the journal in `font-size: 0.5em`, so any size
 *  rule we add compounds and breaks proportions.
 *
 *  The left ribbon's colour is driven by the `--log-accent` CSS variable,
 *  defaulting to the soft violet ink when no biome is provided. Per-entry
 *  overrides (entryCssForAccent) just change that variable. */
export const historyEntryCss = css`
  width: 100%;
  background: linear-gradient(180deg, rgba(255, 250, 236, 0.7) 0%, rgba(243, 231, 202, 0.55) 100%) !important;
  border: 0.06em solid rgba(106, 79, 140, 0.18);
  border-left: 0.25em solid var(--log-accent, ${inkSoft}) !important;
  border-radius: 0.18em;
  margin: 0.25em 0;
  padding: 0.55em 0.7em 0.6em 0.8em !important;
  line-height: 1.4;
  color: ${ink} !important;
  white-space: normal;
  box-shadow:
    inset 0 0.06em 0 rgba(255, 255, 255, 0.55),
    0.06em 0.1em 0 rgba(58, 31, 92, 0.05);
`

/** Per-entry helper: set the --log-accent CSS variable so the base
 *  historyEntryCss picks it up for the left ribbon. */
export const entryCssForAccent = (accent: string): Interpolation<Theme> => css`
  --log-accent: ${accent};
`

/** Generic entry style for moves without a biome (setup discard, etc.).
 *  Empty interpolation — the base historyEntryCss already defaults the
 *  ribbon to inkSoft when --log-accent is unset. */
export const entryCss: Interpolation<Theme> = undefined

/** Dramatic variant for the sacrifice log line: faint city-red wash
 *  + ribbon glow. The sacrifice is the only "loss" event in the
 *  journal and deserves a distinct visual cue. */
export const sacrificeEntryCss: Interpolation<Theme> = css`
  --log-accent: ${city};
  background:
    linear-gradient(180deg, rgba(168, 56, 56, 0.10) 0%, rgba(168, 56, 56, 0.04) 100%),
    linear-gradient(180deg, rgba(255, 250, 236, 0.7), rgba(243, 231, 202, 0.55)) !important;
  border-color: rgba(168, 56, 56, 0.22);
  border-left-width: 0.3em !important;
`

/** ButtonLink for inline "région {value}" / "sanctuaire" mentions.
 *  Dotted orange underline (not the framework's plain underline) to
 *  match the rulebook's annotation feel. Reset every native button
 *  default via linkButtonCss first so the journal's parent button
 *  recipe doesn't bleed in. */
export const linkCss = [linkButtonCss, css`
  color: ${orangeDeep} !important;
  font-weight: 600;
  font-style: normal !important;
  cursor: pointer;
  text-decoration: none !important;
  border-bottom: 0.12em dotted ${orange};
  padding-bottom: 0.04em;
  background: transparent !important;
  font-family: inherit !important;
  font-size: inherit !important;
  transition: color 180ms ease, border-color 180ms ease;

  &:hover {
    color: ${ink} !important;
    border-bottom-color: ${ink};
  }
`]

/** Mini-card wrapper. Small inline thumbnail with a -2°/+2° tilt that
 *  straightens + scales on hover. Each card alternates tilt direction
 *  via the `tiltRight` prop so consecutive minis don't lean the same way. */
export const miniCardWrapperCss = (tiltRight?: boolean) => css`
  display: inline-block;
  vertical-align: middle;
  margin: 0 0.3em;
  cursor: pointer;
  transform: rotate(${tiltRight ? 2 : -2}deg);
  transition: transform 220ms ease, filter 220ms ease;
  position: relative;
  z-index: 1;

  &:hover {
    transform: rotate(0deg) scale(1.5) translateY(-0.1em);
    z-index: 5;
    filter: drop-shadow(0 0.4em 0.6em rgba(58, 31, 92, 0.3));
  }
`

/** System separator style. The dispatcher returns this for the
 *  "Final scoring begins" line. Dramatic = Lilita One orange, with
 *  dotted side rules built via ::before/::after pseudos. */
export const dramaticSeparatorCss: Interpolation<Theme> = css`
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 0.6em 0.4em !important;
  margin: 0.8em 0 0.5em !important;
  font-family: 'Lilita One', cursive;
  letter-spacing: 0.08em;
  color: ${orangeDeep} !important;
  font-style: normal;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.8em;

  & > div {
    flex-shrink: 0;
    white-space: nowrap;
  }

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 0.1em;
    background: linear-gradient(90deg, transparent, ${orangeDeep}, transparent);
    opacity: 0.6;
  }
`

/** Round separator: "Round X / 8" at the start of every PlaceRegion
 *  phase. Visually quieter than the dramatic scoring separator —
 *  Fjalla One uppercase ink with dotted violet rules on both sides
 *  (echoing the rulebook's section markers). The chunky orange round
 *  number gets a Lilita One face to make it pop a bit.
 *
 *  Several rules use `!important` to win over theme.journal.historyEntry
 *  (the global "billet" treatment that gives every other log row its
 *  paper background, border-left ribbon, and box-shadow). Without
 *  these overrides the separator would inherit a paper card frame and
 *  the dotted side rules would render on top of a ribbon. */
export const roundSeparatorCss: Interpolation<Theme> = css`
  background: transparent !important;
  border: none !important;
  border-left: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 0.5em 0.4em !important;
  margin: 0.8em 0 0.5em !important;
  font-family: 'Fjalla One', sans-serif !important;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${ink} !important;
  font-size: 2.4em !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.7em;

  & > div {
    flex-shrink: 0;
    white-space: nowrap;
  }

  /* Highlight the round number in orange Lilita One — same accent
     treatment as the rulebook's chapter pastilles. */
  strong {
    font-family: 'Lilita One', cursive;
    font-weight: 400;
    color: ${orangeDeep};
    letter-spacing: 0;
    padding: 0 0.15em;
  }

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 0.5em;
    background-image: radial-gradient(circle, ${ink} 0 0.07em, transparent 0.09em);
    background-size: 0.55em 0.55em;
    background-repeat: repeat-x;
    background-position: 0 50%;
    opacity: 0.5;
  }
`

/** Row wrapper around the "Active extensions" button at the top of the
 *  journal. The framework wraps each SetupLogItem in an entry div
 *  (display: flex, dark pill background, padding-left, font-size 2em).
 *  We strip the chrome and force flex so the inner div around our
 *  component grows to fill the row, otherwise the button's width: 100%
 *  collapses to the natural width of its label. */
export const extensionsButtonRowCss: Interpolation<Theme> = css`
  background: transparent !important;
  border: none !important;
  border-left: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0.3em 0 0.6em !important;
  display: flex !important;

  /* Make the inner wrapper div around <log.Component/> take the full
     row width so our 100%-wide button actually renders edge to edge. */
  & > div {
    flex: 1;
    min-width: 0;
  }
`

/** Mulligan separator: dotted violet rules + ink Fjalla One label,
 *  same structural recipe as the round separator but visually quieter
 *  (smaller font, no orange Lilita One number). Used only in non-
 *  beginner games right after the "Active extensions" button. */
export const mulliganSeparatorCss: Interpolation<Theme> = css`
  background: transparent !important;
  border: none !important;
  border-left: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 0.4em 0.4em !important;
  margin: 0.4em 0 0.3em !important;
  font-family: 'Fjalla One', sans-serif !important;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: ${inkSoft} !important;
  font-size: 1.2em !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.7em;

  & > div {
    flex-shrink: 0;
    white-space: nowrap;
  }

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 0.35em;
    background-image: radial-gradient(circle, ${inkSoft} 0 0.05em, transparent 0.07em);
    background-size: 0.45em 0.45em;
    background-repeat: repeat-x;
    background-position: 0 50%;
    opacity: 0.55;
  }
`
