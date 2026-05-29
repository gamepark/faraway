/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Region } from '@gamepark/faraway/cards/Region'
import { Regions } from '@gamepark/faraway/cards/Regions'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { getRegionCardScore } from '@gamepark/faraway/rules/helper/ScoreHelper'
import { MaterialLogProps, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { ScoreBubble } from '../../locators/description/RegionScorePointBubble'
import { linkCss } from '../logStyles'
import { buildOpenItemHelpMove } from '../useOpenItemHelp'
import { MiniCard } from './MiniCard'
import { TimeIcon } from './TimeIcon'

type Variant = 'place' | 'pick' | 'reveal'

type Props = MaterialLogProps & { variant: Variant }

/** Region move log: "<player> played a region <time/> <card/>" (or
 *  "<player> took a region ..." for the pick variant). The mini-card
 *  carries the full visual info (number, biome) and the day/night
 *  icon (TimeIcon) tags the line with the time-of-day at a glance.
 *
 *  Both the link text and the mini-card resolve to the same
 *  `displayMaterialHelp` move, dispatched through <PlayMoveButton
 *  transient> so the framework handles the open-help lifecycle.
 *
 *  We rebuild the post-move state by replaying the move on a cloned
 *  game so item.id is correct right after the framework move. When
 *  the id is hidden from this client (other players' cards), we fall
 *  back to a flat "<player> played a region" with no link, no time
 *  icon, no mini-card.
 */
export const RegionMoveLog: FC<Props> = ({ move, context, variant }) => {
  const player = (move as any).location?.player ?? context.action.playerId
  const name = usePlayerName(player) || ''
  const rules = new FarawayRules(structuredClone(context.game))
  rules.play(move)
  const itemIndex = (move as any).itemIndex
  const item = rules.material(MaterialType.Region).getItem<Region>(itemIndex)
  const id = item?.id as Region | undefined
  const helpMove = buildOpenItemHelpMove(MaterialType.Region, item, itemIndex)
  // Night cards carry a `night: number` on their CardDescription (the
  // count of night symbols printed on the card); day cards have nothing
  // there. There's no third state — a region is either day or night.
  // The number displayed in the centre of the disc is the SAME on both
  // sides: the big number printed on the card face, i.e. id % 100
  // (helper getValue() does the same modulo).
  const isNight = id !== undefined && Regions[id]?.night !== undefined
  const cardValue = id !== undefined ? id % 100 : 0

  // Hide the card details whenever the post-move card is face-down on
  // the line. During the exploration phase every placement lands with
  // rotation === undefined / false: even our own card stays a secret
  // in the shared journal until RevealRegionCards flips them face-up.
  // The `pick` variant keeps its own visibility rules (the framework's
  // hide strategy already returns id=undefined for other players).
  const isFaceDown = variant === 'place' && item?.location.rotation !== true
  const showCard = id !== undefined && !isFaceDown

  const i18nKey = showCard
    ? `log.region.${variant}`
    : `log.region.${variant}.unknown`
  // For reveal entries (final scoring), surface the score earned by the
  // card alongside the mini-card so the journal acts as a per-tick recap.
  // Read from the replayed-game state (rules.game above) so the figure is
  // historical, not affected by later sacrifices that retroactively change
  // live scores.
  const revealScore = variant === 'reveal' && showCard
    ? getRegionCardScore(rules.game, itemIndex)
    : undefined
  return (
    <>
      <Trans
        i18nKey={i18nKey}
        values={{ player: name }}
        components={{
          ref: <PlayMoveButton css={linkCss} move={helpMove} transient/>,
          time: showCard ? <TimeIcon isNight={isNight} value={cardValue}/> : <span/>,
          card: showCard
            ? <MiniCard itemType={MaterialType.Region} itemId={id!} tiltRight={itemIndex % 2 === 1} move={helpMove}/>
            : <span/>
        }}
      />
      {revealScore !== undefined && (
        <>
          <FontAwesomeIcon icon={faArrowRight} css={arrowCss}/>
          <span css={bubbleSlotCss}>
            <ScoreBubble score={revealScore}/>
          </span>
        </>
      )}
    </>
  )
}

const bubbleSlotCss = css`
  display: inline-flex;
  width: 2.6em;
  height: 2.6em;
  vertical-align: middle;
`

const arrowCss = css`
  margin: 0 0.5em;
  opacity: 0.7;
  vertical-align: middle;
`
