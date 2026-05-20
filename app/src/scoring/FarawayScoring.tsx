import { css } from '@emotion/react'
import { Region } from '@gamepark/faraway/cards/Region'
import { Sanctuary } from '@gamepark/faraway/cards/Sanctuary'
import { SanctuaryQuests } from '@gamepark/faraway/cards/SanctuaryQuests'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { getRegionCardScore, ScoreHelper } from '@gamepark/faraway/rules/helper/ScoreHelper'
import { MaterialComponent, pointerCursorCss, ScoringDescription, ScoringValue, usePlay } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import SanctuaryBack from '../images/sanctuary/sanctuary_card_back.jpg'

const displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

/**
 * Result dialog scoring breakdown:
 *  - one row per region card position (7..0) — matches the score sheet, which
 *    lists the LAST played card (x=7) at the top
 *  - one row for the player's sanctuaries (showing the sanctuary total)
 *  - one final "Total" row with the full player score (regions + sanctuaries)
 *
 * Position is 0-indexed in code; the first column shows it as 1..8 (the natural
 * "card 1, card 2…" labeling players see during play).
 */
type ScoringKey = number | 'sanctuary' | 'total'

export class FarawayScoring implements ScoringDescription<PlayerId, FarawayRules, ScoringKey> {

  getScoringKeys(): ScoringKey[] {
    return [7, 6, 5, 4, 3, 2, 1, 0, 'sanctuary', 'total']
  }

  getScoringHeader(key: ScoringKey): ScoringValue {
    if (key === 'total') return <div css={headerCss}><Trans i18nKey="scoring.total" defaults="Total"/></div>
    if (key === 'sanctuary') return <div css={headerCss}><div css={sanctuaryHeaderCss}/></div>
    // Cards appear in x=7→x=0 order (matches score sheet, last-played at the top).
    // Labels are play order though: the FIRST row is "card 1" (x=7 = last played),
    // the LAST row is "card 8" (x=0 = first played). Hence label = 8 - x.
    return <div css={headerCss}>{8 - key}</div>
  }

  getScoringPlayerData(key: ScoringKey, player: PlayerId, rules: FarawayRules): ScoringValue | null {
    if (key === 'total') {
      return new ScoreHelper(rules.game, player).score
    }

    if (key === 'sanctuary') {
      const indexes = rules.material(MaterialType.Sanctuary)
        .location(LocationType.PlayerSanctuaryLine)
        .player(player)
        .getIndexes()
      if (indexes.length === 0) return null
      return (
        <div css={sanctuaryRowCss}>
          {indexes.map(index => {
            const item = rules.material(MaterialType.Sanctuary).getItem<Sanctuary>(index)
            if (item.id === undefined) return null
            const quest = SanctuaryQuests[item.id]
            const score = quest ? quest.getTotalScore(rules.game, index, MaterialType.Sanctuary, player) : 0
            return <SanctuaryScoreCell key={index} sanctuaryId={item.id} index={index} score={score}/>
          })}
        </div>
      )
    }

    const matched = rules.material(MaterialType.Region)
      .location(LocationType.PlayerRegionLine)
      .player(player)
      .location(loc => loc.x === key)
    const indexes = matched.getIndexes()
    if (indexes.length === 0) return null
    const index = indexes[0]
    const item = rules.material(MaterialType.Region).getItem<Region>(index)
    if (item.id === undefined) return null

    const score = getRegionCardScore(rules.game, index)
    return <RegionScoreCell regionId={item.id} index={index} score={score}/>
  }
}

const RegionScoreCell: FC<{ regionId: Region; index: number; score: number }> = ({ regionId, index, score }) => {
  const play = usePlay()
  const onClick = () => play(displayMaterialHelp(MaterialType.Region, { id: regionId }, index), { local: true })
  return (
    <div css={[cellCss, pointerCursorCss]} onClick={onClick}>
      <MaterialComponent type={MaterialType.Region} itemId={regionId}/>
      <span css={scoreOverlayCss}>{score}</span>
    </div>
  )
}

const SanctuaryScoreCell: FC<{ sanctuaryId: Sanctuary; index: number; score: number }> = ({ sanctuaryId, index, score }) => {
  const play = usePlay()
  const onClick = () => play(displayMaterialHelp(MaterialType.Sanctuary, { id: sanctuaryId }, index), { local: true })
  return (
    <div css={[cellCss, pointerCursorCss]} onClick={onClick}>
      <MaterialComponent type={MaterialType.Sanctuary} itemId={sanctuaryId}/>
      <span css={scoreOverlayCss}>{score}</span>
    </div>
  )
}

// Region card description is 7×7em; the result-dialog em is large, so we shrink
// the cell so the card lands at a digestible size next to the player avatars.
const cellCss = css`
  position: relative;
  display: inline-flex;
  font-size: 0.7em;
`

const headerCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 700;
`

// Sanctuary back tile in the header column for the sanctuary row. Sized to the
// real sanctuary aspect ratio (4.4×6.8 em from SanctuaryCardDescription).
const sanctuaryHeaderCss = css`
  background-image: url(${SanctuaryBack});
  background-size: cover;
  background-position: center;
  width: 3em;
  aspect-ratio: 4.4 / 6.8;
  border-radius: 0.3em;
  margin: 0 auto;
  box-shadow: 0 0.1em 0.2em rgba(0, 0, 0, 0.4);
`

// Sanctuaries are listed 2 per row in the cell — players can hold up to 4 sanctuaries
// in some endgames, and a single horizontal row gets too wide for the column.
const sanctuaryRowCss = css`
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.4em;
  justify-content: center;
  align-items: center;
`

// Score badge centered on the card. No z-index — DOM order keeps it on top of
// the card image while staying BELOW the framework's sticky header (which uses
// z-index: 1 to cover scrolling content).
const scoreOverlayCss = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3em;
  font-weight: 900;
  color: white;
  text-shadow:
    0 0 0.15em black,
    0.05em 0.05em 0.1em black,
    -0.05em -0.05em 0.1em black,
    0 0 0.3em black;
  pointer-events: none;
`
