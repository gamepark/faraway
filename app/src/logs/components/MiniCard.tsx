/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { fontSizeCss, MaterialComponent, PlayMoveButton } from '@gamepark/react-game'
import { FC } from 'react'
import { miniCardWrapperCss } from '../logStyles'

type Props = {
  itemType: number
  itemId: number
  /** Used to alternate tilt direction between consecutive cards (true → +2°, false → -2°).
   *  Caller passes a deterministic flag (e.g. itemIndex parity) so the layout is stable. */
  tiltRight?: boolean
  /** displayMaterialHelp move that opens the help dialog for this card.
   *  Dispatched through PlayMoveButton+transient so the framework handles
   *  the play() call without committing a real game move. */
  move?: any
}

/** Inline mini-card rendered inside a log line. The card is the real
 *  MaterialComponent from the framework (with proper image + biome
 *  artwork) shrunk via `fontSizeCss` to a tiny inline thumbnail.
 *
 *  Two visual flourishes from the rulebook mockup:
 *   - a slight ±2° tilt (rulebook-style "card pinned to the page") that
 *     alternates by `tiltRight` so consecutive logs don't lean the same way;
 *   - on hover the card straightens, scales 1.5×, and casts a drop shadow,
 *     turning the inline thumbnail into a readable preview.
 *
 *  Rendered via <PlayMoveButton> + transient so clicking opens the help
 *  dialog the same way as clicking the link text — both routes dispatch
 *  the same displayMaterialHelp move.
 */
export const MiniCard: FC<Props> = ({ itemType, itemId, tiltRight, move }) => (
  <PlayMoveButton css={[buttonResetCss, miniCardWrapperCss(tiltRight)]} move={move} transient>
    <MaterialComponent
      type={itemType}
      itemId={itemId}
      css={fontSizeCss(0.35)}
    />
  </PlayMoveButton>
)

/* PlayMoveButton renders a <ThemeButton> under the hood — itself a plain
   <button>. We strip its default chrome (border, background, padding,
   text alignment) so it behaves as a transparent wrapper around the
   MaterialComponent. The tilt + hover effects live in miniCardWrapperCss. */
const buttonResetCss = css`
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  color: inherit !important;
  font: inherit !important;
  line-height: 0 !important;
  text-align: inherit !important;

  &:focus { outline: none; }
`
