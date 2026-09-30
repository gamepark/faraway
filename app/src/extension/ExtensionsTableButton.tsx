/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { useRules } from '@gamepark/react-game'
import { FC, useState } from 'react'
import { Trans } from 'react-i18next'
import {
  getScoreSheetPosition,
  getTableXMin,
  getTableYMax,
  scoreSheetHeight,
  scoreSheetWidth
} from '../panels/PanelConstants'
import { stampButtonCss } from '../theme'
import { isBeyondTheVeil } from './isBeyondTheVeil'
import { ExtensionsCarouselDialog } from './ExtensionsCarouselDialog'
import { useExtensionPopups } from './useExtensionPopups'

// The button hugs the top edge of the score sheet: same width, same left offset, so the two read as a single block.
// The score sheet moves with Beyond the Veil (deck column instead of the bottom-left corner), so the button follows it.
const BUTTON_HEIGHT = 2.4
// Small gap between the button's bottom edge and the score sheet's top edge so the rounded corners read cleanly.
const BUTTON_GAP = 0.4

/** Table-anchored "Extensions actives" button that sits right above the
 *  score sheet in the bottom-left corner of the game table. Clicking opens
 *  the ExtensionsCarouselDialog (same as the journal entry). Local
 *  useState owns the open flag — the dialog is self-contained.
 *
 *  Renders nothing when no extension is active: this button is a quick
 *  "what extensions am I playing with?" reminder, not a permanent UI
 *  element. */
export const ExtensionsTableButton: FC = () => {
  const { popups } = useExtensionPopups()
  const rules = useRules<FarawayRules>()
  const [open, setOpen] = useState(false)
  if (popups.length === 0) return null
  const beyondTheVeil = isBeyondTheVeil(rules)
  const scoreSheet = getScoreSheetPosition(beyondTheVeil)
  // CSS offsets are relative to the table box, whose origin is its top-left corner
  const left = scoreSheet.x - scoreSheetWidth / 2 - getTableXMin(beyondTheVeil)
  const bottom = getTableYMax(beyondTheVeil) - (scoreSheet.y - scoreSheetHeight / 2) + BUTTON_GAP
  return (
    <>
      <button type="button" css={[stampButtonCss, positionCss(left, bottom)]} onClick={() => setOpen(true)}>
        <span css={labelCss}><Trans i18nKey="log.extensions.button"/></span>
      </button>
      <ExtensionsCarouselDialog popups={popups} open={open} onClose={() => setOpen(false)}/>
    </>
  )
}

/* Position-only layer on top of the global stampButtonCss recipe so the
   table button keeps the rulebook look (orange fill, violet outline, 3D
   drop shadow, Fjalla One) shared with every other button in the game.
   We only override the things that wouldn't fit the table-anchored use
   case: padding (we want a flat banner above the score sheet, not a
   chunky stamp), width (to hug the score sheet exactly), and bottom
   border-radius (square where it meets the score sheet). */
const positionCss = (left: number, bottom: number) => css`
  position: absolute;
  left: ${left}em;
  bottom: ${bottom}em;
  width: ${scoreSheetWidth}em;
  height: ${BUTTON_HEIGHT}em;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

/* Label scaled down so the localized text fits the 7.2em width without
   truncation. Lives on an inner span — applying a smaller font-size
   directly on the button would shrink the em-sized box itself. */
const labelCss = css`
  font-size: 0.7em;
`
