/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
// Use the full-resolution day.png / night.png — same "rond" the help
// dialog displays for night cards (see RegionCardHelp). The -mini PNGs
// are designed for the in-game header counters and read as flat
// stickers next to the journal text; the full assets keep the same
// embossed-disc look as the help dialog.
import Day from '../../images/time/day.png'
import Night from '../../images/time/night.png'

type Props = {
  /** True when the card is a "night" card (`Regions[id]?.night` defined).
   *  Day is the default — every region prints a big day number on its face;
   *  night cards add a small night marker in the corner. */
  isNight: boolean
  /** The day/night number to render in the centre of the disc. */
  value: number
}

/** Inline day/night badge for region log lines.
 *
 *  Layout: the day-or-night disc image (the "rond" from the help
 *  dialog) is rendered as a CSS background of an inline-block wrapper,
 *  with the card's number stacked on top, centred in the disc. Reading
 *  the journal you get the time-of-day at a glance AND the card value
 *  without needing to hover the mini-card.
 *
 *  Size note: the wrapper is sized in em (2em) so it scales with the
 *  journal's font-size context. Anything smaller and the number stops
 *  reading; anything larger and it overflows the line height. The
 *  -0.4em vertical margin compensates for the disc visually overflowing
 *  the text baseline, so the surrounding line spacing stays calm. */
export const TimeIcon: FC<Props> = ({ isNight, value }) => (
  <span css={discCss(isNight)}>
    <span css={numberCss(isNight)}>{value}</span>
  </span>
)

const discCss = (isNight: boolean) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3em;
  height: 3em;
  /* Negative margin compensates for the disc visually overflowing the
     text baseline. Without it the line height stretches and the journal
     looks wobbly. Adjust together with width/height. */
  margin: -1em 0.2em;
  vertical-align: middle;
  background-image: url(${isNight ? Night : Day});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const numberCss = (isNight: boolean) => css`
  font-family: 'Lilita One', cursive;
  font-size: 1.4em;
  line-height: 1;
  /* Always render in the rulebook violet ink — matches the day disc's
     printed number and stays consistent across day/night. The night
     disc has a light moon centre in its artwork so violet still reads. */
  color: #3a1f5c;
  text-shadow: 0 0.05em 0 rgba(255, 255, 255, 0.5);
  /* Each disc artwork has its centre slightly off the canvas centre:
     the day disc's halo sits a touch right of centre (push the number
     right), the night disc's moon sits a touch left of centre (push
     the number left). Both get the same small downward nudge to sit
     in the optical centre rather than the font's geometric centre. */
  transform: translate(${isNight ? '-0.08em' : '0.08em'}, 0.02em);
`
