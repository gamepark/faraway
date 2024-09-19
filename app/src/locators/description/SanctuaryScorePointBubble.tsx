/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Quest } from '@gamepark/faraway/cards/quests/Quest'
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
  const quests = SanctuaryQuests
  const rules = useRules<FarawayRules>()!
  const item = rules?.material(MaterialType.Sanctuary).getItem(location.parent!)
  const quest: Quest = item.id? quests[item.id]: undefined
  if (!quest) return null
  const score = quest.getTotalScore(rules.game, location.parent!, MaterialType.Sanctuary, item.location.player!)
  return (
    <div css={scoreStyle}>
      {score}
    </div>
  )
}

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
`