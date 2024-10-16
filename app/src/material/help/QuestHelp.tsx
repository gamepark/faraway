/** @jsxImportSource @emotion/react */
import { ColorQuest } from '@gamepark/faraway/cards/quests/ColorQuest'
import { Quest } from '@gamepark/faraway/cards/quests/Quest'
import { QuestType } from '@gamepark/faraway/cards/quests/QuestType'
import { Trans, useTranslation } from 'react-i18next'

export const QuestHelp = ({ quest }: { quest: Quest }) => {
  const { t } = useTranslation()
  switch (quest.type) {
    case QuestType.Clue:
      return <Trans defaults="help.quest.clue" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Chimera:
      return <Trans defaults="help.quest.chimera" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Rock:
      return <Trans defaults="help.quest.rock" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Thistle:
      return <Trans defaults="help.quest.thistle" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Color:
      const colors = (quest as ColorQuest).colors
      if (colors.length === 1) {
        return <Trans defaults="help.quest.color" values={{ points: quest.points, biome: t(`biome.${colors[0]}`) }}><em/></Trans>
      } else {
        return <Trans defaults="help.quest.colors" values={{ points: quest.points, biome1: t(`biome.${colors[0]}`), biome2: t(`biome.${colors[1]}`) }}>
          <em/><strong/>
        </Trans>
      }
    case QuestType.AllColor:
      return <Trans defaults="help.quest.all-color" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Night:
      return <Trans defaults="help.quest.night" values={{ points: quest.points }}><em/></Trans>
    case QuestType.BrutPoints:
      return <Trans defaults="help.quest.points" values={{ points: quest.points }}><em/></Trans>
    case QuestType.WonderSet:
      return <Trans defaults="help.quest.wonder-set" values={{ points: quest.points }}><em/></Trans>

  }
}
