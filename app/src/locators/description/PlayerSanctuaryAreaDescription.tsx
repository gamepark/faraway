import { css } from '@emotion/react'
import { DropAreaDescription } from '@gamepark/react-game'
import SanctuaryBack from '../../images/sanctuary/sanctuary_card_back.jpg'
import { SANCTUARY_ZONE_HEIGHT, SANCTUARY_ZONE_WIDTH } from '../playerLayout'

/**
 * Visual zone marking the sanctuary line — a single drop area covering the full
 * grid, with a tiny sanctuary card-back badge anchored in the bottom-left corner.
 */
export class PlayerSanctuaryAreaDescription extends DropAreaDescription {
  width = SANCTUARY_ZONE_WIDTH
  height = SANCTUARY_ZONE_HEIGHT
  borderRadius = 0.4

  extraCss = css`
    background-color: rgba(255, 255, 255, 0.2);

    &::after {
      content: '';
      position: absolute;
      bottom: 0.25em;
      left: 0.25em;
      width: 1.2em;
      height: 1.85em;
      background-image: url(${SanctuaryBack});
      background-size: cover;
      background-position: center;
      border-radius: 0.15em;
      box-shadow: 0 0.05em 0.15em rgba(0, 0, 0, 0.5);
      opacity: 0.85;
    }
  `
}
