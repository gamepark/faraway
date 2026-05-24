/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GameTheme, RulesDialog } from '@gamepark/react-game'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  /** Carousel slides — one node per extension. Typically rendered by
   *  useExtensionPopups(). */
  popups: ReactNode[]
  /** Open/closed state. Owned by the caller so the dialog can be opened
   *  on demand (e.g. from the journal "Active extensions" button)
   *  without going through the framework's sessionStorage gate. */
  open: boolean
  /** Called when the user dismisses the dialog (Close button, X icon,
   *  backdrop). The caller flips `open` to false. */
  onClose: () => void
}

/** Faraway-side companion to the framework's <ExtensionInfoDialog>.
 *
 *  Why it's separate from the framework one:
 *   - the framework dialog manages a sessionStorage "show once per tab
 *     session" gate for the auto-open at game start (still used by
 *     GameDisplay's <ExtensionInfoDialog/>);
 *   - the journal "Active extensions" button needs an ALWAYS-openable
 *     dialog that doesn't touch sessionStorage. The two flows fight if
 *     they share state.
 *
 *  Layout + ExtensionNav mirror the framework's ExtensionInfoDialog
 *  verbatim so both flows look identical. Kept in its own file because
 *  it might be re-used elsewhere (a menu entry, a help icon, etc.). */
export const ExtensionsCarouselDialog: FC<Props> = ({ popups, open, onClose }) => {
  // The framework's emotion module augmentation lives in its own .d.ts
  // and isn't picked up by faraway's tsconfig — cast via GameTheme to
  // get the right surface without declaration merging.
  const theme = useTheme() as GameTheme
  const [index, setIndex] = useState(0)
  const total = popups.length
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, total - 1))

  // Reset the carousel cursor when the dialog re-opens (NOT when it
  // closes): the close animation lasts ~300ms during which the dialog
  // is still mounted. Resetting on close means the "Close" button on
  // the last slide visibly flickers back to "Next" before the dialog
  // fades out. Resetting on the rising edge of `open` keeps the label
  // stable during the close transition and still lands on page 1 the
  // next time the dialog appears.
  useEffect(() => {
    if (open) setIndex(0)
  }, [open])

  if (total === 0) return null

  const onPrevious = safeIndex > 0 ? () => setIndex(i => i - 1) : undefined
  const onNext = safeIndex < total - 1 ? () => setIndex(i => i + 1) : undefined

  return (
    <RulesDialog open={open} close={onClose} css={[dialogContainerCss, theme.extensionDialog?.container as any]}>
      <div css={dialogLayoutCss}>
        <div css={dialogContentCss}>
          {popups[safeIndex]}
        </div>
        <ExtensionNav
          total={total}
          currentIndex={safeIndex}
          onPrevious={onPrevious}
          onNext={onNext}
          onClose={onClose}
        />
      </div>
    </RulesDialog>
  )
}

/* ----- Inline nav (mirrors the framework's ExtensionInfoDialog nav) -----
 *
 * Layout rules — identical to the framework's ExtensionNav so both
 * dialogs feel the same:
 *   - total === 1                    → centered Close
 *   - total > 1, last page           → Previous + dots + Close
 *   - total > 1, intermediate page   → Previous + dots + Next
 */
type ExtensionNavProps = {
  total: number
  currentIndex: number
  onPrevious?: () => void
  onNext?: () => void
  onClose: () => void
}

const ExtensionNav: FC<ExtensionNavProps> = ({ total, currentIndex, onPrevious, onNext, onClose }) => {
  const { t } = useTranslation()
  const theme = useTheme() as GameTheme
  const primary = theme.palette?.primary ?? '#28B8CE'

  if (total === 1) {
    return (
      <div css={[barCss(primary), singleSlideBarCss, theme.dialog?.navigationCss as any]}>
        <button css={btnCss(primary)} onClick={onClose}>
          <span>{t('Close', { ns: 'common' })}</span>
        </button>
      </div>
    )
  }

  const isLast = currentIndex === total - 1
  return (
    <div css={[barCss(primary), theme.dialog?.navigationCss as any]}>
      <button css={btnCss(primary)} onClick={onPrevious} disabled={!onPrevious}>
        <FontAwesomeIcon icon={faChevronLeft} css={iconCss}/>
        <span>{t('Previous', { ns: 'common' })}</span>
      </button>
      <div css={counterCss}>
        <div css={dotsCss}>
          {Array.from({ length: Math.min(total, 8) }, (_, i) => (
            <div key={i} css={[dotCss(primary), i === Math.min(currentIndex, 7) && activeDotCss(primary)]}/>
          ))}
        </div>
        <span>{currentIndex + 1} / {total}</span>
      </div>
      {isLast ? (
        <button css={btnCss(primary)} onClick={onClose}>
          <span>{t('Close', { ns: 'common' })}</span>
        </button>
      ) : (
        <button css={btnCss(primary)} onClick={onNext} disabled={!onNext}>
          <span>{t('Next', { ns: 'common' })}</span>
          <FontAwesomeIcon icon={faChevronRight} css={iconCss}/>
        </button>
      )}
    </div>
  )
}

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

/* Visual recipe copied verbatim from the framework's ExtensionInfoDialog
   ExtensionNav so the two carousels look identical. Keep in sync when
   the framework one evolves. */
const barCss = (primary: string) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 2.4em;
  padding: 0.3em 1em;
  border-top: 1px solid color-mix(in srgb, ${primary} 8%, transparent);
  background: linear-gradient(to top, color-mix(in srgb, ${primary} 4%, transparent), transparent);
`

const singleSlideBarCss = css`
  justify-content: center;
`

const btnCss = (primary: string) => css`
  display: flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.4em 0.9em;
  border-radius: 2em;
  font-size: 0.78em;
  font-weight: 600;
  font-family: inherit;
  color: ${primary};
  background: transparent;
  border: 1.5px solid color-mix(in srgb, ${primary} 25%, transparent);
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, ${primary} 10%, transparent);
    border-color: ${primary};
  }

  &:active:not(:disabled) {
    background: color-mix(in srgb, ${primary} 18%, transparent);
  }

  &:disabled {
    opacity: 0.25;
    cursor: default;
  }
`

const iconCss = css`
  font-size: 0.9em;
`

const counterCss = css`
  font-size: 0.75em;
  color: inherit;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-weight: 600;
`

const dotsCss = css`
  display: flex;
  gap: 0.3em;
`

const dotCss = (primary: string) => css`
  width: 0.35em;
  height: 0.35em;
  border-radius: 50%;
  background: color-mix(in srgb, ${primary} 35%, transparent);
  transition: all 0.2s;
`

const activeDotCss = (primary: string) => css`
  background: ${primary};
  width: 1em;
  border-radius: 0.2em;
`
