/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC, useState } from 'react'
import { Trans } from 'react-i18next'
import { ExtensionsCarouselDialog } from '../../extension/ExtensionsCarouselDialog'
import { useExtensionPopups } from '../../extension/useExtensionPopups'

const ink = '#3a1f5c'
const orange = '#e87a3a'
const orangeDeep = '#c45f24'
const paper = '#f5ebd6'

/** Top-of-journal entry: a "Active extensions" button that opens
 *  <ExtensionsCarouselDialog> on click. Local useState owns the open
 *  state so no Context / module store is required. The dialog itself
 *  lives in its own file in `app/src/extension/` so it can be reused
 *  elsewhere (menu entry, help icon, ...). */
export const ExtensionsButtonLog: FC = () => {
  const { popups } = useExtensionPopups()
  const [open, setOpen] = useState(false)

  // No extension active → render a quiet "no extensions" line instead
  // of the orange CTA + dialog. Keeping the entry visible (rather than
  // returning null) makes the journal explicit about the game's setup
  // for spectators and replay viewers.
  if (popups.length === 0) {
    return <span css={noExtensionCss}><Trans i18nKey="log.extensions.none"/></span>
  }

  return (
    <>
      <button type="button" css={buttonCss} onClick={() => setOpen(true)}>
        <Trans i18nKey="log.extensions.button"/>
      </button>
      <ExtensionsCarouselDialog popups={popups} open={open} onClose={() => setOpen(false)}/>
    </>
  )
}

const noExtensionCss = css`
  display: block;
  width: 100%;
  text-align: center;
  font-family: 'Crimson Pro', Georgia, serif;
  font-style: italic;
  font-size: 1.4em;
  color: ${ink};
  opacity: 0.55;
  padding: 0.4em 0;
`

const buttonCss = css`
  display: block;
  width: 100%;
  background: ${orange};
  color: ${paper};
  border: 0.13em solid ${ink};
  border-radius: 0.3em;
  box-shadow: 0 0.18em 0 ${ink};
  padding: 0.6em 1em 0.5em;
  font-family: 'Fjalla One', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 500;
  font-size: 1.4em;
  cursor: pointer;
  text-shadow: 0 0.05em 0 ${orangeDeep};
  transition: transform 120ms ease, background 200ms ease;

  &:hover {
    background: ${orangeDeep};
  }

  &:active {
    transform: translateY(0.1em);
    box-shadow: 0 0.06em 0 ${ink};
  }

  &:focus {
    outline: none;
  }
`
