import { ColorQuest } from '@gamepark/faraway/cards/quests/ColorQuest'
import { Quest } from '@gamepark/faraway/cards/quests/Quest'
import { QuestType } from '@gamepark/faraway/cards/quests/QuestType'
import { Trans, useTranslation } from 'react-i18next'

export const QuestHelp = ({ quest }: { quest: Quest }) => {
  const { t } = useTranslation()
  switch (quest.type) {
    case QuestType.Clue:
      return <Trans i18nKey="help.quest.clue" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Chimera:
      return <Trans i18nKey="help.quest.chimera" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Rock:
      return <Trans i18nKey="help.quest.rock" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Thistle:
      return <Trans i18nKey="help.quest.thistle" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Color:
      const colors = (quest as ColorQuest).colors
      if (colors.length === 1) {
        return <Trans i18nKey="help.quest.color" values={{ points: quest.points, biome: t(`biome.${colors[0]}`) }}><em/></Trans>
      } else {
        return <Trans i18nKey="help.quest.colors" values={{ points: quest.points, biome1: t(`biome.${colors[0]}`), biome2: t(`biome.${colors[1]}`) }}>
          <em/><strong/>
        </Trans>
      }
    case QuestType.AllColor:
      return <Trans i18nKey="help.quest.all-color" values={{ points: quest.points }}><em/></Trans>
    case QuestType.Night:
      return <Trans i18nKey="help.quest.night" values={{ points: quest.points }}><em/></Trans>
    case QuestType.BrutPoints:
      return <Trans i18nKey="help.quest.points" values={{ points: quest.points }}><em/></Trans>
    case QuestType.WonderSet:
      return <Trans i18nKey="help.quest.wonder-set" values={{ points: quest.points }}><em/></Trans>

  }
}
