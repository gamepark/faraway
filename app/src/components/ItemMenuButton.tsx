import { css, Global } from '@emotion/react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faHand } from '@fortawesome/free-solid-svg-icons/faHand'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemMenuButton as FrameworkItemMenuButton, ItemButtonProps } from '@gamepark/react-game'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

/**
 * Faraway-themed wrapper around the framework's {@link FrameworkItemMenuButton}.
 *
 * Visuals replicate the in-game score-pill icon: cream rounded square, thick navy
 * border, 4 yellow corner pegs, navy glyph.
 *
 * Positioning (angle + radius) is delegated to the framework — pass `angle` and
 * `radius` to fan buttons around the center of the card.
 *
 * Pass `titleKey` (an i18n key) rather than a raw string: it is resolved via
 * `react-i18next` for the accessible tooltip, and optionally rendered as a
 * visible `<Trans>` label when `showLabel` is truthy.
 */

type FarawayMenuButtonProps = ItemButtonProps & {
  icon: IconDefinition
  titleKey: string
}

export const HandIcon = faHand
export const TrashIcon = faTrashCan

export const FarawayMenuButton: FC<FarawayMenuButtonProps> = ({ icon, titleKey, ...buttonProps }) => {
  const { t } = useTranslation()
  const resolved = t(titleKey)
  return (
    <>
      <Global styles={menuVisibilityCss}/>
      <FrameworkItemMenuButton
        {...buttonProps}
        css={buttonCss}
        aria-label={resolved}
        title={resolved}
      >
        <span css={depthAdjustCss} className="depth-adjust">
          <span css={pegCss} className="peg tl"/>
          <span css={pegCss} className="peg tr"/>
          <span css={pegCss} className="peg bl"/>
          <span css={pegCss} className="peg br"/>
          <span css={bodyCss} className="body">
            <FontAwesomeIcon icon={icon} css={iconCss}/>
          </span>
        </span>
        <span css={srOnlyCss}><Trans i18nKey={titleKey}/></span>
      </FrameworkItemMenuButton>
    </>
  )
}

// ---- palette tokens ----
const INK   = '#1a2638'
const CREAM = '#f7ecd0'
const SUN   = '#eeb83a'

// ---- styles ----
// The framework applies an inline `transform` for positioning, so the hover effect
// lives on the inner body span rather than on the button itself.
const buttonCss = css`
  width: 2em !important;
  height: 2em !important;
  padding: 0;
  background: transparent !important;
  border: 0;
  border-radius: 0 !important;
  position: absolute;
  cursor: pointer;

  /* Default peg positions = 4 corners. On hover each peg slides to the center
     of an edge (clockwise mapping: tl→top, tr→right, br→bottom, bl→left). */
  .peg.tl { top: -0.25em; left: -0.25em; right: auto; bottom: auto; }
  .peg.tr { top: -0.25em; right: -0.25em; left: auto; bottom: auto; }
  .peg.bl { bottom: -0.25em; left: -0.25em; right: auto; top: auto; }
  .peg.br { bottom: -0.25em; right: -0.25em; left: auto; top: auto; }

  .peg, .body {
    transition: top 0.18s ease, right 0.18s ease, bottom 0.18s ease, left 0.18s ease,
                transform 0.18s cubic-bezier(.3, 1.4, .4, 1),
                box-shadow 0.14s ease, filter 0.14s ease;
  }

  &:not(:disabled):hover .body {
    transform: translateZ(0.01em) scale(1.1);
    filter: brightness(1.06);
  }

  &:not(:disabled):hover .peg.tl {
    top: -0.4em;
    left: 50%;
    transform: translate(-50%, 0) translateZ(-0.01em);
  }
  &:not(:disabled):hover .peg.tr {
    top: 50%;
    right: -0.4em;
    transform: translate(0, -50%) translateZ(-0.01em);
  }
  &:not(:disabled):hover .peg.br {
    bottom: -0.4em;
    right: 50%;
    transform: translate(50%, 0) translateZ(-0.01em);
  }
  &:not(:disabled):hover .peg.bl {
    bottom: 50%;
    left: -0.4em;
    transform: translate(0, 50%) translateZ(-0.01em);
  }

  &:not(:disabled):active .body {
    transform: translateZ(0.01em) scale(0.96);
    box-shadow: 0 0.05em 0.15em rgba(26, 38, 56, 0.35);
  }
  &:disabled { opacity: 0.5; filter: grayscale(0.6); cursor: not-allowed; }
`

const pegCss = css`
  position: absolute;
  width: 0.85em;
  height: 0.85em;
  background: ${SUN};
  border: 0.14em solid ${INK};
  border-radius: 50%;
  /* In a transform-style: preserve-3d context, z-index alone doesn't stack
     siblings reliably (Firefox respects the 3D Z coordinate). Push pegs back
     a hair so the body is unambiguously in front. */
  transform: translateZ(-0.01em);
`

const bodyCss = css`
  position: absolute;
  inset: 0;
  background: ${CREAM};
  border: 0.18em solid ${INK};
  border-radius: 0.3em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.15em 0.3em rgba(26, 38, 56, 0.25);
  /* Explicit translateZ keeps the body in front of pegs in 3D space — without
     it, Firefox renders the body behind the pegs (or behind the card itself)
     because all sibling spans sit at the same Z in a preserve-3d parent. */
  transform: translateZ(0.01em);
`

const iconCss = css`
  font-size: 1.2em;
  color: ${INK};
`

// sr-only: the <Trans> sits in the DOM for screen readers / e2e selectors but is visually hidden.
const srOnlyCss = css`
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
`

// Wrapper that carries the button's effective translateZ.
//
//  - default: nearly cancel the framework's translateZ(15em) on the menu wrapper, landing
//    the visible content at card_z + 0.025em — i.e. between the own card (at card_z) and the
//    next card in the fan (at card_z + deltaZ ≈ 0.05em). So neighbour cards in a hand fan
//    naturally cover the parts of the button that bleed onto them, while the button is still
//    in front of its own card.
//  - on hover, the framework lifts the card visual to card_z + ~25em (see ItemDisplay.js
//    hoverCss). We override the translateZ via {@link menuVisibilityCss} to push the button
//    forward to card_z + 30em so it stays in front.
const depthAdjustCss = css`
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: translateZ(-14.975em);
  transition: transform 0.15s ease;
`

// Global CSS that lifts the hovered card's button above its lifted visual. The framework
// renders each item as an `ItemDisplay` <div> immediately followed by its `ItemMenuWrapper`
// <div> as flat siblings (see DraggableMaterial.js). We identify the menu wrapper via its
// FarawayMenuButton child (`.peg.tl` is our marker) and react to the preceding sibling's
// hover state with `+ :hover`.
const menuVisibilityCss = css`
  div:hover + div:has(> button > .depth-adjust > .peg.tl) > button > .depth-adjust {
    transform: translateZ(15em);
  }
`
