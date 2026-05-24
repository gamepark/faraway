/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react'
import { BottomBarNavigation, GameTheme, RulesDialog } from '@gamepark/react-game'
import { FC, useState } from 'react'
import { Trans } from 'react-i18next'
import { useExtensionPopups } from '../../extension/useExtensionPopups'

const ink = '#3a1f5c'
const orange = '#e87a3a'
const orangeDeep = '#c45f24'
const paper = '#f5ebd6'

/** Top-of-journal entry that bundles the "Active extensions" button
 *  AND its companion dialog. Local useState owns the open/closed state
 *  so we don't need a Context, a module-level store, or any GameDisplay
 *  wiring. Mirrors the way Faraway's Headers each embed their own
 *  dialog inline rather than letting GameDisplay orchestrate them.
 *
 *  Why a duplicate of the framework's <ExtensionInfoDialog>:
 *   - the framework dialog manages a sessionStorage gate to "show once
 *     per tab session" automatically — that's exactly what we want for
 *     the auto-open at game start (kept in GameDisplay);
 *   - the journal button needs an ALWAYS-openable dialog that doesn't
 *     touch sessionStorage. The two flows fight if shared.
 *  So we mount the same carousel twice with different ownership rules:
 *  the framework one for auto-open, this one for manual re-open. */
export const ExtensionsButtonLog: FC = () => {
  const { popups } = useExtensionPopups()
  const [open, setOpen] = useState(false)
  // The framework's emotion module augmentation (declare module '@emotion/react')
  // lives in its own .d.ts and isn't picked up by faraway's tsconfig — without
  // this cast `theme.dialog` / `theme.extensionDialog` come back as `any` via
  // unknown but TS still flags the access as a missing property. Casting via
  // GameTheme keeps the right surface without depending on declaration merging.
  const theme = useTheme() as GameTheme
  const [index, setIndex] = useState(0)
  const total = popups.length
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, total - 1))

  // No extension active → render a quiet "no extensions" line instead
  // of the orange CTA + dialog. Keeping the entry visible (rather than
  // returning null) makes the journal explicit about the game's setup
  // for spectators and replay viewers.
  if (total === 0) {
    return <span css={noExtensionCss}><Trans i18nKey="log.extensions.none"/></span>
  }

  const close = () => { setOpen(false); setIndex(0) }
  const openDialog = () => { setIndex(0); setOpen(true) }
  const onPrevious = safeIndex > 0 ? () => setIndex(i => i - 1) : undefined
  const onNext = safeIndex < total - 1 ? () => setIndex(i => i + 1) : undefined

  const Navigation = theme.dialog.navigation ?? BottomBarNavigation

  return (
    <>
      <button type="button" css={buttonCss} onClick={openDialog}>
        <Trans i18nKey="log.extensions.button"/>
      </button>
      <RulesDialog open={open} close={close} css={[dialogContainerCss, theme.extensionDialog?.container as any]}>
        <div css={dialogLayoutCss}>
          <div css={dialogContentCss}>
            {popups[safeIndex]}
          </div>
          {total > 1 && (
            <Navigation onPrevious={onPrevious} onNext={onNext} currentIndex={safeIndex} total={total}/>
          )}
        </div>
      </RulesDialog>
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

const dialogContainerCss = css`
  width: min(90vw, 70em);
  width: min(90dvw, 70em);
`

const dialogLayoutCss = css`
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  max-height: 90dvh;
`

const dialogContentCss = css`
  font-size: 2.4em;
  overflow-y: auto;
  padding: 0.6em 0.7em 0.5em;
  flex: 1;
  min-height: 0;
`
