import { css } from '@emotion/react'
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
    <FrameworkItemMenuButton
      {...buttonProps}
      css={buttonCss}
      aria-label={resolved}
      title={resolved}
    >
      <span css={pegCss} className="peg tl"/>
      <span css={pegCss} className="peg tr"/>
      <span css={pegCss} className="peg bl"/>
      <span css={pegCss} className="peg br"/>
      <span css={bodyCss}>
        <FontAwesomeIcon icon={icon} css={iconCss}/>
      </span>
      <span css={srOnlyCss}><Trans i18nKey={titleKey}/></span>
    </FrameworkItemMenuButton>
  )
}

// ---- palette tokens ----
const INK   = '#1a2638'
const CREAM = '#f7ecd0'
const SUN   = '#eeb83a'

// ---- styles ----
const buttonCss = css`
  width: 2em !important;
  height: 2em !important;
  padding: 0;
  background: transparent !important;
  border: 0;
  border-radius: 0 !important;
  position: absolute;
  transition: transform 0.14s cubic-bezier(.3, 1.4, .4, 1);

  .peg.tl { top: -0.25em; left: -0.25em; }
  .peg.tr { top: -0.25em; right: -0.25em; }
  .peg.bl { bottom: -0.25em; left: -0.25em; }
  .peg.br { bottom: -0.25em; right: -0.25em; }

  &:not(:disabled):hover { filter: brightness(1.05); }
  &:not(:disabled):active { filter: brightness(0.92); }
  &:disabled { opacity: 0.5; filter: grayscale(0.6); cursor: not-allowed; }
`

const pegCss = css`
  position: absolute;
  width: 0.85em;
  height: 0.85em;
  background: ${SUN};
  border: 0.14em solid ${INK};
  border-radius: 50%;
  z-index: 0;
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
  z-index: 1;
  box-shadow: 0 0.15em 0.3em rgba(26, 38, 56, 0.25);
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
