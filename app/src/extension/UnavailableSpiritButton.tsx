import { css } from '@emotion/react'
import { faHand } from '@fortawesome/free-solid-svg-icons/faHand'
import { faSlash } from '@fortawesome/free-solid-svg-icons/faSlash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemMenuButton, RulesDialog } from '@gamepark/react-game'
import { FC, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

/**
 * Button on the face-up card of the Spirit deck: that Spirit is only there to be read, it is not one of the 2 available ones.
 * A crossed-out hand says it cannot be taken, and the dialog says when it will come into play.
 */
export const UnavailableSpiritButton: FC = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const label = t('button.spirit.unavailable')
  return (
    <>
      <ItemMenuButton x={-2.5} y={-3.5} css={buttonCss} onClick={() => setOpen(true)} aria-label={label} title={label}>
        <span css={iconStackCss}>
          <FontAwesomeIcon icon={faHand}/>
          <FontAwesomeIcon icon={faSlash} css={slashCss}/>
        </span>
      </ItemMenuButton>
      <RulesDialog open={open} close={() => setOpen(false)}>
        <div css={dialogCss}>
          <h2><Trans i18nKey="help.spirit.unavailable.title"/></h2>
          <p><Trans i18nKey="help.spirit.unavailable"/></p>
        </div>
      </RulesDialog>
    </>
  )
}

const buttonCss = css`
  background-color: #f5ebd6;
  color: #3a1f5c;
  box-shadow: 0 0.1em 0.2em rgba(0, 0, 0, 0.5);
`

/* The two glyphs are stacked so the slash crosses the hand: FontAwesome ships no "crossed-out hand" in the free set. */
const iconStackCss = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
`

const slashCss = css`
  position: absolute;
  left: 50%;
  top: 50%;
  /* Slightly larger than the hand, and outlined, so the bar still reads at the size of a menu button */
  transform: translate(-50%, -50%) scale(1.15);
  color: #c0392b;
  filter: drop-shadow(0 0 0.06em #f5ebd6) drop-shadow(0 0 0.06em #f5ebd6);
`

const dialogCss = css`
  font-size: 3.4em;
  padding: 0.7em 1.2em 1em;
  max-width: 17em;

  h2 {
    margin: 0 0 0.6em;
    /* Room for the dialog close button, which sits in the top-right corner */
    padding-right: 1.2em;
  }

  p {
    font-size: 0.9em;
    margin: 0;
    line-height: 1.5;
  }
`
