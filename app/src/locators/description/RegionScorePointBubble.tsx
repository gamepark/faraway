/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Quest } from '@gamepark/faraway/cards/quests/Quest'
import { RegionQuests } from '@gamepark/faraway/cards/RegionQuests'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { SpeechBubble, SpeechBubbleDirection, useRules } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { FC } from 'react'

type RegionScorePointBubbleProps = {
  location: Location
}

export const RegionScorePointBubble: FC<RegionScorePointBubbleProps> = (props) => {
  const { location } = props
  const quests = RegionQuests
  const rules = useRules<FarawayRules>()!
  const item = rules?.material(MaterialType.Region).getItem(location.parent!)!
  const quest: Quest = item.id? quests[item.id]: undefined
  if (!quest) return null
  const score = quest.getTotalScore(rules.game, location.parent!, item.location.player!)
  return (
    <SpeechBubble direction={SpeechBubbleDirection.TOP_RIGHT} css={scoreStyle}>
      {score}
    </SpeechBubble>
  )
}

const scoreStyle = css`
  font-size: 0.9em;
  color: black;
  filter: drop-shadow(0.15em 0.15em black)
`