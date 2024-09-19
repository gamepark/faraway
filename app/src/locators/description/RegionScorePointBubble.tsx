/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Quest } from '@gamepark/faraway/cards/quests/Quest'
import { RegionQuests } from '@gamepark/faraway/cards/RegionQuests'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { useRules } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { FC } from 'react'
import fame from '../../images/icon/fame.png'

type RegionScorePointBubbleProps = {
  location: Location
}

export const RegionScorePointBubble: FC<RegionScorePointBubbleProps> = (props) => {
  const { location } = props
  const quests = RegionQuests
  const rules = useRules<FarawayRules>()!
  const item = rules?.material(MaterialType.Region).getItem(location.parent!)
  const quest: Quest = item.id ? quests[item.id] : undefined
  if (!quest) return null
  const score = quest.getTotalScore(rules.game, location.parent!, MaterialType.Region, item.location.player!)
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

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    left: 0;
    border-right-color: white;
    border-right-width: 0.6em;
    border-left: 0;
    margin-left: -0.3em;
    bottom: 0;
    border-top-width: 0.4em;
    border-bottom: 0;
    margin-bottom: 0.4em;
  }


`