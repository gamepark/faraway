import { css } from '@emotion/react'
import { BottomBarNavigation, GameTheme } from '@gamepark/react-game'

/**
 * Frosted-glass sticky headers in the ResultDialog scoring table.
 *
 * The framework's grid uses `grid-auto-flow: column` with R rows, so the top
 * row (where the sticky headers live) is at DOM children R*n + 1. R is:
 *   competitive offset (2 — empty corner + Ranking row) + scoring keys (10).
 * If we ever add/remove scoring keys, bump the modulus.
 *
 * The override forces a semi-transparent background + backdrop blur on those
 * cells so content scrolling underneath becomes blurred (not visible) but the
 * cells still read as "transparent".
 */
const STICKY_ROW_MODULUS = 12
const resultContainerCss = css`
  & > div > div:last-child > div:nth-child(${STICKY_ROW_MODULUS}n + 1) {
    background-color: rgba(240, 251, 252, 0.55) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
`

// Faraway theme overrides. Deep-merged with `defaultTheme` by GameProvider,
// so only the keys that diverge from defaults need to be declared here.
export const theme: Partial<GameTheme> = {
  dialog: {
    backgroundColor: '#f0fbfc',
    color: '#002448',
    // Replaces the default left/right arrow help-dialog navigation with the
    // framework's bottom navigation bar (Previous/Next buttons + step dots).
    navigation: BottomBarNavigation
  },
  result: {
    container: resultContainerCss
  }
}
