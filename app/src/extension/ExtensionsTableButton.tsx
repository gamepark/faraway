/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC, useState } from 'react'
import { Trans } from 'react-i18next'
import { stampButtonCss } from '../theme'
import { ExtensionsCarouselDialog } from './ExtensionsCarouselDialog'
import { useExtensionPopups } from './useExtensionPopups'

// ScoreSheet anchors to the table's bottom-left corner: 7.2 × 9.9em with a
// 0.5em margin from each edge — so its top edge sits 0.5em + 9.9em = 10.4em
// above the table's bottom. The button hugs the score sheet's top: same width,
// same left offset, flush against its top edge so the two read as a single
// bottom-left block.
const SCORE_SHEET_WIDTH = 7.2
const SCORE_SHEET_HEIGHT = 9.9
const SCORE_SHEET_MARGIN = 0.5
const BUTTON_HEIGHT = 2.4
// Small gap between the button's bottom edge and the score sheet's top
// edge so the rounded corners read cleanly (no visual fusion).
const BUTTON_GAP = 0.4
const BUTTON_BOTTOM = SCORE_SHEET_MARGIN + SCORE_SHEET_HEIGHT + BUTTON_GAP

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
  const [open, setOpen] = useState(false)
  if (popups.length === 0) return null
  return (
    <>
      <button type="button" css={[stampButtonCss, positionCss]} onClick={() => setOpen(true)}>
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
const positionCss = css`
  position: absolute;
  left: ${SCORE_SHEET_MARGIN}em;
  bottom: ${BUTTON_BOTTOM}em;
  width: ${SCORE_SHEET_WIDTH}em;
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
