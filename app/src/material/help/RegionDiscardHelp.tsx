import { css } from '@emotion/react'
import { Region } from '@gamepark/faraway/cards/Region'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { LocationHelpProps, MaterialComponent, pointerCursorCss, usePlay, useRules } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'

const displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

/**
 * Help dialog shown when the player clicks the region discard pile. Lists every
 * discarded card so the player can recall what's gone and (with a click) jump to
 * any card's own help dialog.
 *
 * Cards are sorted by descending `location.x` so the most recently discarded
 * appears first — matches what feels natural when reviewing recent moves.
 */
export const RegionDiscardHelp = (_props: LocationHelpProps) => {
  const { t } = useTranslation()
  const cards = useRules<FarawayRules>()
    ?.material(MaterialType.Region)
    .location(LocationType.RegionDiscard)
    .sort(item => -item.location.x!)
  const play = usePlay()
  return <>
    <h2>{t('help.region.discard.title')}</h2>
    <p><Trans i18nKey="help.region.discard.count" values={{ number: cards?.length ?? 0 }}/></p>
    {cards && cards.length > 0 && (
      <ol css={gridCss}>
        {cards.entries.map(([index, card]) => (
          <li key={index}>
            <MaterialComponent
              type={MaterialType.Region}
              itemId={card.id as Region}
              css={pointerCursorCss}
              onClick={() => play(displayMaterialHelp(MaterialType.Region, card, index), { local: true })}
            />
          </li>
        ))}
      </ol>
    )}
  </>
}

const gridCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7em, 1fr));
  list-style-type: none;
  gap: 0.6em;
  padding: 0;
  margin: 0.5em 0 0;
  font-size: 1.2em;

  li {
    display: flex;
    justify-content: center;
  }
`
