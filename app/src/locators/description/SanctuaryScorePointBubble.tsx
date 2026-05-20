import { css, keyframes } from '@emotion/react'
import { Sanctuary } from '@gamepark/faraway/cards/Sanctuary'
import { SanctuaryQuests } from '@gamepark/faraway/cards/SanctuaryQuests'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { useRules } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { FC } from 'react'
import fame from '../../images/icon/fame.png'

type SanctuaryScorePointBubbleProps = {
  location: Location
}

export const SanctuaryScorePointBubble: FC<SanctuaryScorePointBubbleProps> = (props) => {
  const { location } = props
  const rules = useRules<FarawayRules>()!
  const item = rules?.material(MaterialType.Sanctuary).getItem<Sanctuary>(location.parent!)
  const quest = item.id !== undefined ? SanctuaryQuests[item.id] : undefined
  if (!quest) return null
  const score = quest.getTotalScore(rules.game, location.parent!, MaterialType.Sanctuary, item.location.player!)
  return (
    <div css={scoreStyle}>
      {score}
    </div>
  )
}

const popIn = keyframes`
  0%   { opacity: 0; transform: scale(0.88); }
  100% { opacity: 1; transform: scale(1); }
`

const scoreStyle = css`
  background-image: url(${fame});
  background-size: cover;
  width: 100%;
  height: 100%;
  color: black;
  font-weight: bold;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0.1em 0.1em black);
  animation: ${popIn} 0.55s cubic-bezier(.2, .8, .4, 1);
`