import { css } from '@emotion/react'
import { FC } from 'react'

type Props = { onClick: () => void }

/**
 * Rulebook-style close button for every dialog.
 *
 * Orange pastille with a violet ring + violet drop-shadow rim — visual echo of
 * the numbered pastilles used throughout the official rulebook. Replaces the
 * framework's default FontAwesome × via theme.dialog.closeButton.
 *
 * Sizing note: a dialog's own font-size context is the body em (~1vh ≈ 9px on
 * a 900-tall viewport), so plain em values render tiny. We anchor sizes to
 * `calc(Xem * var(--gp-scale))` — same scale knob used by the framework's
 * default close icon (which sits at 4em). The pastille goes a touch bigger
 * because it has a ring + shadow stack to read at a glance.
 */
export const CloseButton: FC<Props> = ({ onClick }) => (
  <button type="button" css={closeBtnCss} onClick={onClick} aria-label="Close">
    <span css={glyphCss}>×</span>
  </button>
)

const closeBtnCss = css`
  position: absolute;
  /* Sit INSIDE the dotted outline (which is inset by ~1.4em via theme.dialog.container).
     Anchoring at ~1.8em keeps the button visually contained within the rulebook frame. */
  top: calc(1.8em * var(--gp-scale, 1));
  right: calc(1.8em * var(--gp-scale, 1));
  width: calc(5em * var(--gp-scale, 1));
  height: calc(5em * var(--gp-scale, 1));
  background: #e87a3a;
  color: #f5ebd6;
  border: calc(0.3em * var(--gp-scale, 1)) solid #3a1f5c;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 100;
  box-shadow:
    inset 0 calc(-0.4em * var(--gp-scale, 1)) calc(0.6em * var(--gp-scale, 1)) rgba(196, 95, 36, 0.5),
    0 calc(0.4em * var(--gp-scale, 1)) 0 #3a1f5c,
    0 calc(0.5em * var(--gp-scale, 1)) calc(1em * var(--gp-scale, 1)) rgba(58, 31, 92, 0.35);
  transition: transform 120ms ease, background 200ms ease;

  &:hover {
    background: #c45f24;
    transform: translateY(calc(-0.1em * var(--gp-scale, 1)));
  }

  &:active {
    transform: translateY(calc(0.2em * var(--gp-scale, 1)));
    box-shadow:
      inset 0 calc(-0.4em * var(--gp-scale, 1)) calc(0.6em * var(--gp-scale, 1)) rgba(196, 95, 36, 0.5),
      0 calc(0.2em * var(--gp-scale, 1)) 0 #3a1f5c;
  }
`

const glyphCss = css`
  font-family: 'Lilita One', cursive;
  font-size: calc(3.6em * var(--gp-scale, 1));
  /* line-height: 1 + flex centering on the parent keeps the × glyph squarely
     in the middle of the button regardless of the font's internal metrics. */
  line-height: 1;
  display: block;
  text-shadow: 0 calc(0.08em * var(--gp-scale, 1)) 0 #c45f24;
`
