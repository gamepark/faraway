import { css } from '@emotion/react'
import { BottomBarNavigation, GameTheme } from '@gamepark/react-game'
import { historyEntryCss } from '../logs/logStyles'
import { CloseButton } from './CloseButton'

/**
 * ═══════════════════════════════════════════════════════════════════
 * FARAWAY — THEME "RULEBOOK FAITHFUL"
 *
 * Direction artistique tirée du livret de règles officiel du jeu.
 * Palette : papier crème + encre violet + accent orange + cire magenta
 *           (réservée aux marqueurs Cieux Étoilés).
 * Typographie : Lilita One (display chunky, logo), Crimson Pro (body italic),
 *               Fjalla One (heavy uppercase headers).
 * Les fonts sont chargées dans app/index.html via Google Fonts.
 * ═══════════════════════════════════════════════════════════════════
 */

const paper       = '#f5ebd6'
const paperWarm   = '#f0e1c4'
const ink         = '#3a1f5c'
const inkSoft     = '#6a4f8c'
const orange      = '#e87a3a'
const orangeDeep  = '#c45f24'

/* Frosted sticky-header override for the end-game ResultDialog scoring grid.
   See previous theme note: the grid uses `grid-auto-flow: column` with R rows
   (competitive offset 2 + scoring keys 10 = 12), so the sticky top row sits
   at children R*n + 1. */
const STICKY_ROW_MODULUS = 12
const resultContainerCss = css`
  & > div > div:last-child > div:nth-child(${STICKY_ROW_MODULUS}n + 1) {
    background-color: rgba(245, 235, 214, 0.55) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
`

/* Global "rulebook stamp" button recipe.
   Applied via theme.buttons to every <button> the framework styles:
   - inside Dialogs (help, rules, extension, result, tutorial — see Dialog.tsx)
   - in the Header (theme.buttons + theme.header.buttons layering)
   - in <ThemeButton/> (used by confirmation popups, etc.)
   This way the rulebook look — rectangular stamp, violet outline, 3D drop
   shadow, Fjalla One uppercase — propagates everywhere without per-component
   overrides. Spots that need a different look (e.g. Next vs Previous in the
   nav bar) layer further CSS on top via theme.dialog.navigationCss.

   Default visual is the "primary" stamp (orange fill, paper text) since that
   reads as the natural CTA. Variants are picked off in the navigationCss
   block below using :first-of-type / :last-of-type selectors. */
const stampButtonCss = css`
  font-family: 'Fjalla One', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 500;

  background: ${orange};
  color: ${paper};
  border: 0.13em solid ${ink};
  border-radius: 0.3em;
  box-shadow: 0 0.18em 0 ${ink};
  /* Fjalla One has heavy bottom whitespace in its em box (descender area is
     mostly empty since the font has no descenders). With symmetric padding
     the label looks shifted upward. Add ~0.1em more on top to compensate. */
  padding: 0.45em 1em 0.35em;
  text-shadow: 0 0.05em 0 ${orangeDeep};
  cursor: pointer;
  transition: transform 120ms ease, background 200ms ease;

  &:hover:not(:disabled) {
    background: ${orangeDeep};
  }

  &:active:not(:disabled) {
    transform: translateY(0.1em);
    box-shadow: 0 0.06em 0 ${ink};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.4;
    box-shadow: 0 0.1em 0 ${inkSoft};
    border-color: ${inkSoft};
    color: ${inkSoft};
    background: ${paper};
    text-shadow: none;
    cursor: auto;
  }
`

/* CSS overrides for the framework's BottomBarNavigation bar.
   BottomBarNavigation applies its own btnCss directly via `css={btnCss(primary)}`
   on each button — pill-shaped, transparent, primary-coloured. That CSS is
   sibling-specific and beats anything coming from theme.buttons via the
   ThemeProvider. So we can't rely on the global stamp recipe here: we have
   to re-stamp explicitly, with `!important` to win against btnCss.
   - rectangular stamp (not pill), 3D drop shadow
   - Previous = secondary (paper bg + violet text)
   - Next = primary (orange fill + paper text + orange-deep text-shadow)
   - bottom margin so the dotted outline doesn't cut through the bar */
const navigationCss = css`
  margin-bottom: 0.6em;

  button {
    font-family: 'Fjalla One', sans-serif !important;
    text-transform: uppercase !important;
    letter-spacing: 0.14em !important;
    font-weight: 500 !important;
    border-radius: 0.3em !important;
    border: 0.13em solid ${ink} !important;
    box-shadow: 0 0.18em 0 ${ink} !important;
    /* Same vertical-balance trick as the global stamp: Fjalla One sits high
       in its em box, so more padding-top than padding-bottom. */
    padding: 0.45em 1em 0.35em !important;
    transition: transform 120ms ease, background 200ms ease !important;
  }

  /* Previous (first button) — secondary: paper outline */
  button:first-of-type {
    background: ${paper} !important;
    color: ${ink} !important;
    text-shadow: none !important;
  }

  button:first-of-type:hover:not(:disabled) {
    background: ${paperWarm} !important;
  }

  /* Next (last button) — primary: orange filled stamp */
  button:last-of-type {
    background: ${orange} !important;
    color: ${paper} !important;
    text-shadow: 0 0.05em 0 ${orangeDeep};
  }

  button:last-of-type:hover:not(:disabled) {
    background: ${orangeDeep} !important;
  }

  button:active:not(:disabled) {
    transform: translateY(0.1em);
    box-shadow: 0 0.06em 0 ${ink} !important;
  }

  button:disabled {
    opacity: 0.4;
    box-shadow: 0 0.1em 0 ${inkSoft} !important;
    border-color: ${inkSoft} !important;
    color: ${inkSoft} !important;
    text-shadow: none !important;
  }
`

export const theme: Partial<GameTheme> = {
  /* Rulebook-stamp recipe for every framework-styled button (dialogs,
     header, ThemeButton). See stampButtonCss above for the rationale. */
  buttons: stampButtonCss,

  palette: {
    /* Orange is the action accent in the rulebook — used on the numbered
       pastilles and "next step" callouts. So it stays primary CTA color. */
    primary:        orange,
    primaryHover:   orangeDeep,
    primaryActive:  '#a85220',
    primaryLight:   '#fce5cc',
    primaryLighter: paperWarm,

    surface:         paper,
    onSurface:       ink,
    onSurfaceFocus:  'rgba(232, 122, 58, 0.16)',
    onSurfaceActive: 'rgba(232, 122, 58, 0.28)',

    danger:       '#a83838',  /* city-biome red */
    dangerHover:  '#c84a4a',
    dangerActive: '#8a2a2a',

    disabled: '#a89eb3'
  },

  dialog: {
    backgroundColor: paper,
    color: ink,
    /* Keep the framework's default Previous/Next/dots bar (separator + page
       count + accessibility), and tweak it via theme.dialog.navigationCss. */
    navigation: BottomBarNavigation,
    navigationCss,
    /* Rulebook-style close button: orange pastille with violet ring. */
    closeButton: CloseButton,
    /* Inset dotted violet border + rulebook typography (Lilita One titles,
       Crimson Pro body, Fjalla One uppercase labels). Applied to every Dialog
       — help dialogs, the extension popup, the result dialog — so the entire
       app reads as a continuation of the printed rulebook. */
    container: css`
      padding: calc(3em * var(--gp-scale, 1));
      outline: 3px dotted rgba(58, 31, 92, 0.55);
      outline-offset: calc(-1.4em * var(--gp-scale, 1));

      /* Set Crimson Pro on the dialog root so every descendant — including
         loose <span>s the framework drops inside buttons — inherits the right
         body font by default. Specific elements (h*, button) then override. */
      font-family: 'Crimson Pro', Georgia, serif;
      color: ${ink};

      h1, h2, h3 {
        font-family: 'Lilita One', cursive;
        font-weight: 400;
        color: ${ink};
        letter-spacing: 0.005em;
      }

      strong, b {
        font-weight: 600;
        color: ${ink};
      }

      em, i {
        font-style: italic;
        color: ${inkSoft};
      }

      /* Buttons themselves are styled via theme.buttons (stampButtonCss).
         We only force the Fjalla One font on every node inside a button so
         that the framework's <span> wrapper around labels picks up the right
         font (theme.buttons sets it on <button>, but inline spans wouldn't
         inherit the family in all emotion specificity contexts). */
      button * {
        font-family: 'Fjalla One', sans-serif;
      }
    `
  },

  /* Tutorial popups reuse Dialog under the hood, so they inherit the
     rulebook container (padding + dotted outline + typography). That looks
     wrong for tutorial popups, which are small floating callouts pinned to
     a coordinate — the heavy padding eats their content and the dotted
     outline reads as a duplicate of the main app dialog frame. Override:
     keep the typography, but compress padding and drop the outline. */
  tutorial: {
    container: css`
      padding: 1.5em 1.8em !important;
      outline: none !important;
    `,
    /* Tutorial buttons (Previous / Next / OK / Pass) are PlayMoveButton /
       ThemeButton — they pick up theme.buttons (the rulebook stamp), which
       is calibrated for full-size app dialogs. On a small floating tutorial
       popup the stamp reads as oversized. Scale it down here without losing
       the recipe (still orange/violet stamped, just compact). */
    content: css`
      button {
        font-size: 0.85em;
        /* Asymmetric padding for the same reason as the global stamp:
           Fjalla One sits high inside its em box, so equal top/bottom
           padding reads as "label too high". Slightly more on top. */
        padding: 0.4em 0.7em 0.3em;
        letter-spacing: 0.1em;
        border-width: 0.1em;
        box-shadow: 0 0.13em 0 ${ink};
      }

      button:active:not(:disabled) {
        box-shadow: 0 0.04em 0 ${ink};
      }

      /* The Pass button is the only one rendered as a direct child of the
         tutorial content div (the framework gives it position: absolute and
         drops it in the top-right corner — see MaterialTutorialDisplay.tsx).
         The Previous / Next / OK buttons live inside a <p css={buttonsLine}>
         further down. Using "& > button" lets us shrink only the Pass
         button without touching the others. */
      & > button {
        font-size: 0.75em;
        padding: 0.35em 0.7em 0.25em;
        letter-spacing: 0.1em;
        box-shadow: 0 0.12em 0 ${ink};
      }
    `
  },

  /* Journal "rulebook billet" treatment: every log entry inherits a
     paper-tinted card with a coloured left ribbon. The ribbon colour
     is driven by --log-accent, set per-entry by FarawayLogs through
     each MovePlayedLogDescription's `css` field (biome / sacrifice /
     system). Without this theme.journal.historyEntry override the
     framework defaults each log row to its dark pill style. */
  journal: {
    historyEntry: historyEntryCss
  },

  /* Let the extensions popup pick its own width based on content.
     The framework's default is `width: min(90vw, 70em)` which forces
     a fixed box even when the actual content is narrower (or wants
     to be wider). Overriding to `auto` makes the dialog hug its grid
     of cards + lede, while the max-width clamp prevents overflow on
     small screens. */
  extensionDialog: {
    container: css`
      width: auto !important;
      max-width: 92vw;
      max-width: 92dvw;
    `
  },

  result: {
    container: resultContainerCss
  }
}
