/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Quest } from '@gamepark/faraway/cards/quests/Quest'
import { SanctuaryQuests } from '@gamepark/faraway/cards/SanctuaryQuests'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { useRules } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { FC } from 'react'

type SanctuaryScorePointBubbleProps = {
  location: Location
}

export const SanctuaryScorePointBubble: FC<SanctuaryScorePointBubbleProps> = (props) => {
  const { location } = props
  const quests = SanctuaryQuests
  const rules = useRules<FarawayRules>()!
  const item = rules?.material(MaterialType.Sanctuary).getItem(location.parent!)!
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
  background-color: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0.15em 0.15em black);
  border-radius: 0.4em;
  padding: 0.2em 0.4em;
`