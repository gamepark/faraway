import { css } from '@emotion/react'
import { Region } from '@gamepark/faraway/cards/Region'
import { Sanctuary } from '@gamepark/faraway/cards/Sanctuary'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { faMap } from '@fortawesome/free-solid-svg-icons/faMap'
import { faGopuram } from '@fortawesome/free-solid-svg-icons/faGopuram'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialComponent } from '@gamepark/react-game'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  eyebrow: ReactNode
  title: ReactNode
  description: ReactNode
  regions: Region[]
  sanctuaries?: Sanctuary[]
  /** Number of regions per row in the grid. Defaults to 3 (expansion1 layout).
   *  Starry Skies has 15 regions and reads better on a wider 5-column grid. */
  regionsPerRow?: number
  /** Layout flavour:
   *   - 'split'   : 2 columns body — regions left, sanctuaries right —
   *                 below a full-width lede. Original expansion1 layout.
   *   - 'compact' : single auto-sized column (regions only). Used when the
   *                 popup ships no sanctuaries — the dialog then hugs its
   *                 content width instead of reserving an empty 2nd column.
   *  Defaults to 'split'. */
  layout?: 'split' | 'compact'
}

/**
 * Slide unique du carrousel d'extensions, version Rulebook Faithful.
 *
 * Charte tirée du livret officiel :
 *   - Papier crème + encre violet (#3a1f5c) + accent orange (#e87a3a)
 *   - Pastille orange "I" en marqueur d'eyebrow (mimétisme du livret)
 *   - Tampon "X NEW CARDS" en angle (-3°) pour le counter
 *   - Pointillés violets pour les séparateurs (jamais de hairlines pleines)
 *   - Lilita One pour titres + chiffres, Crimson Pro italic pour le body,
 *     Fjalla One pour les labels uppercase.
 *
 * Tailles de fonte alignées sur la version précédente (le user a explicitement
 * demandé de ne pas grossir la typo).
 */
export const FarawayExtensionPopup: FC<Props> = ({ eyebrow, title, description, regions, sanctuaries, regionsPerRow = 3, layout = 'split' }) => {
  const { t } = useTranslation()
  const total = regions.length + (sanctuaries?.length ?? 0)

  // Reusable building blocks: the regions and sanctuaries sections are
  // arranged differently per layout below, so we factor them out here.
  const regionsSection = (
    <section css={cardsColCss}>
      <div css={sectionHeadCss}>
        <span css={sectionPastilleCss}><FontAwesomeIcon icon={faMap}/></span>
        <div css={sectionLabelCss}>{t('extension.regions.label', { count: regions.length })}</div>
        <span css={sectionDotLineCss}/>
      </div>
      <div css={[gridCss, regionsGridCss(regionsPerRow)]}>
        {regions.map((id, i) => (
          <MaterialComponent
            key={`r-${id}-${i}`}
            type={MaterialType.Region}
            itemId={id}
            css={cardCss}
          />
        ))}
      </div>
    </section>
  )

  const sanctuariesSection = sanctuaries && sanctuaries.length > 0 ? (
    <section css={cardsColCss}>
      <div css={sectionHeadCss}>
        <span css={sectionPastilleCss}><FontAwesomeIcon icon={faGopuram}/></span>
        <div css={sectionLabelCss}>{t('extension.sanctuaries.label', { count: sanctuaries.length })}</div>
        <span css={sectionDotLineCss}/>
      </div>
      <div css={[gridCss, sanctuariesGridCss]}>
        {sanctuaries.map((id, i) => (
          <MaterialComponent
            key={`s-${id}-${i}`}
            type={MaterialType.Sanctuary}
            itemId={id}
            css={cardCss}
          />
        ))}
      </div>
    </section>
  ) : null

  return (
    <article css={popupCss}>
      <header css={headerCss}>
        <div css={headerTextCss}>
          <div css={eyebrowCss}>
            <span css={eyebrowPastilleCss}><FontAwesomeIcon icon={faStar}/></span>
            <span>{eyebrow}</span>
          </div>
          <h2 css={titleCss}>{title}</h2>
        </div>
        <div css={counterStampCss}>
          <span css={counterNumCss}>{total}</span>
          <span css={counterLabelCss}>{t('extension.cards.label.short', { defaultValue: 'new cards' })}</span>
        </div>
      </header>

      <div css={dividerCss}/>

      <p css={ledeCss}>{description}</p>
      <div css={cardsAreaCss(layout)}>
        {regionsSection}
        {sanctuariesSection}
      </div>
    </article>
  )
}

// ————————————— STYLES (rulebook) —————————————

const INK         = '#3a1f5c'
const INK_SOFT    = '#6a4f8c'
const INK_DOTS    = 'rgba(58, 31, 92, 0.35)'
const PAPER       = '#f5ebd6'
const ORANGE      = '#e87a3a'
const ORANGE_DEEP = '#c45f24'
const ORANGE_TINT = 'rgba(232, 122, 58, 0.16)'

const popupCss = css`
  position: relative;
  /* Subtle warmth from the corner — adds paper depth without overriding the
     framework's dialog backgroundColor (now paper crème via the theme). */
  background:
    radial-gradient(ellipse at 0% 0%, rgba(232, 122, 58, 0.07) 0%, transparent 45%),
    radial-gradient(ellipse at 100% 100%, rgba(58, 31, 92, 0.04) 0%, transparent 50%);
  font-family: 'Crimson Pro', Georgia, serif;
  color: ${INK};
  padding: 0.4em 0.6em 0.2em 0.2em;
`

const headerCss = css`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2em;
  align-items: end;
  padding-right: 2em; /* reserve space for the framework's close button */
`

const headerTextCss = css`
  min-width: 0;
`

const eyebrowPastilleCss = css`
  /* Inline-flex disc that wraps the FontAwesome icon. Width/height
     give us the round container, padding pulls the icon away from the
     ring so the glyph breathes inside the disc rather than hugging
     the border. */
  width: 1.7em;
  height: 1.7em;
  padding: 0.35em;
  background: ${ORANGE};
  color: ${PAPER};
  border: 0.16em solid ${INK};
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85em;
  line-height: 1;
  flex-shrink: 0;
  text-shadow: 0 0.05em 0 ${ORANGE_DEEP};
  box-shadow:
    inset 0 -0.15em 0.25em rgba(196, 95, 36, 0.4),
    0 0.1em 0.2em rgba(58, 31, 92, 0.3);

  /* FontAwesome SVG sizes itself to 1em — let it fill the inner area
     after padding. */
  svg {
    width: 100%;
    height: 100%;
  }
`

const eyebrowCss = css`
  font-family: 'Fjalla One', sans-serif;
  font-size: 0.6em;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${INK};
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.7em;
  margin-bottom: 0.55em;
`

const titleCss = css`
  font-family: 'Lilita One', cursive;
  font-size: 1.9em;
  line-height: 1;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.002em;
  color: ${INK};
  text-shadow: 0 0.04em 0 rgba(58, 31, 92, 0.12);
`

/* Counter as a rotated rulebook stamp. The orange box + violet border + slight
   rotation echoes the "TOUR III" / "VARIANTE" pills from the livret. */
const counterStampCss = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: ${ORANGE};
  color: ${PAPER};
  padding: 0.3em 0.85em 0.4em;
  border-radius: 0.22em;
  border: 0.15em solid ${INK};
  transform: rotate(-3deg);
  flex-shrink: 0;
  line-height: 1;
  box-shadow:
    inset 0 -0.18em 0 rgba(196, 95, 36, 0.4),
    0 0.18em 0.3em rgba(58, 31, 92, 0.3);
  text-shadow: 0 0.05em 0 ${ORANGE_DEEP};
`

const counterNumCss = css`
  font-family: 'Lilita One', cursive;
  font-size: 1.9em;
  letter-spacing: -0.02em;
  line-height: 0.85;
`

const counterLabelCss = css`
  font-family: 'Fjalla One', sans-serif;
  font-size: 0.55em;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-top: 0.25em;
  text-shadow: none;
`

const dividerCss = css`
  /* Dotted violet line, signature of the rulebook layout */
  height: 0;
  border-top: 2px dotted ${INK_DOTS};
  margin: 1em 0 1em;
`

const ledeCss = css`
  font-family: 'Crimson Pro', serif;
  font-style: italic;
  font-size: 0.9em;
  line-height: 1.55;
  color: ${INK};
  max-width: 62ch;
  margin: 0 0 1.4em;
  font-weight: 400;
  text-align: justify;
  /* Honour explicit "\n" line breaks in the translation strings (other
     whitespace still collapses, so wrapping is unaffected). */
  white-space: pre-line;

  /* Highlighter mark behind <strong> spans (Trans <0>...</0> become <strong>). */
  strong {
    font-weight: 600;
    font-style: normal;
    background: linear-gradient(
      transparent 60%,
      ${ORANGE_TINT} 60%,
      ${ORANGE_TINT} 92%,
      transparent 92%
    );
    color: ${ORANGE_DEEP};
    padding: 0 0.08em;
  }

  em {
    font-style: italic;
    color: ${INK_SOFT};
  }
`

/* 'split' = two columns side by side (regions / sanctuaries), used by
   expansion1 which ships both kinds. 'compact' = single auto-sized
   column, used when the popup hugs its actual content width instead
   of reserving an empty 2nd column. */
const cardsAreaCss = (layout: 'split' | 'compact') => css`
  display: grid;
  grid-template-columns: ${layout === 'split' ? 'minmax(0, 1.05fr) minmax(0, 0.95fr)' : 'auto'};
  gap: 1.4em;
`

const cardsColCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  min-width: 0;
`

/* Section head: roman-numeral pastille + label + dotted line, straight from
   the livret's section-marker pattern. */
const sectionHeadCss = css`
  display: flex;
  align-items: center;
  gap: 0.6em;
`

const sectionPastilleCss = css`
  /* Same recipe as the eyebrow pastille — round orange disc with a
     padded FontAwesome glyph that doesn't crowd the ring. Sized a
     touch smaller because the section header sits next to a small
     uppercase label rather than the title row. */
  width: 1.6em;
  height: 1.6em;
  padding: 0.3em;
  background: ${ORANGE};
  color: ${PAPER};
  border: 0.16em solid ${INK};
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85em;
  line-height: 1;
  flex-shrink: 0;
  text-shadow: 0 0.05em 0 ${ORANGE_DEEP};
  box-shadow:
    inset 0 -0.15em 0.25em rgba(196, 95, 36, 0.4),
    0 0.1em 0.2em rgba(58, 31, 92, 0.3);

  svg {
    width: 100%;
    height: 100%;
  }
`

const sectionLabelCss = css`
  font-family: 'Fjalla One', sans-serif;
  font-size: 0.6em;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${INK};
  font-weight: 500;
`

const sectionDotLineCss = css`
  flex: 1;
  height: 0;
  border-top: 2px dotted ${INK_DOTS};
  align-self: center;
`

const gridCss = css`
  display: grid;
  align-items: start;
`

/* Both grids share the same em base so cards keep their REAL-WORLD proportions:
   regions are 7×7em, sanctuaries are 4.4×6.8em — sanctuaries naturally read as
   smaller (narrower and slightly shorter), which is what they look like on the table.
   font-size drives the on-screen card size: 0.75em renders regions at ~5.25em
   wide each. With the popup width bumped to ~88em this still fits a 3-column
   layout comfortably with room for the description text on the left. */
const regionsGridCss = (cols: number) => css`
  grid-template-columns: repeat(${cols}, auto);
  justify-content: start;
  gap: 0.5em;
  font-size: 0.75em;
`

const sanctuariesGridCss = css`
  grid-template-columns: repeat(4, auto);
  justify-content: start;
  gap: 0.5em;
  font-size: 0.75em;
`

const cardCss = css`
  border-radius: 0.25em;
  box-shadow:
    0 0.18em 0.4em rgba(58, 31, 92, 0.22),
    0 0.04em 0.1em rgba(58, 31, 92, 0.2);
`
