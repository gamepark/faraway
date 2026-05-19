import { ColorQuest } from '@gamepark/faraway/cards/quests/ColorQuest'
import { MultiWonderSumQuest } from '@gamepark/faraway/cards/quests/MultiWonderSumQuest'
import { Quest } from '@gamepark/faraway/cards/quests/Quest'
import { QuestType } from '@gamepark/faraway/cards/quests/QuestType'
import { RequireClueQuest } from '@gamepark/faraway/cards/quests/RequireClueQuest'
import { RequireColorQuest } from '@gamepark/faraway/cards/quests/RequireColorQuest'
import { RequireNightQuest } from '@gamepark/faraway/cards/quests/RequireNightQuest'
import { SacrificeQuest } from '@gamepark/faraway/cards/quests/SacrificeQuest'
import { Wonder } from '@gamepark/faraway/cards/Wonder'
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

    // ----- Starry Skies extension -----
    case QuestType.RequireColor: {
      const q = quest as RequireColorQuest
      return <Trans i18nKey="help.quest.require-color"
                    values={{ points: q.points, threshold: q.threshold, biome: t(`biome.${q.color}`) }}>
        <em/><strong/>
      </Trans>
    }
    case QuestType.RequireClue: {
      const q = quest as RequireClueQuest
      return <Trans i18nKey="help.quest.require-clue" values={{ points: q.points, threshold: q.threshold }}>
        <em/><strong/>
      </Trans>
    }
    case QuestType.RequireNight: {
      const q = quest as RequireNightQuest
      return <Trans i18nKey="help.quest.require-night" values={{ points: q.points, threshold: q.threshold }}>
        <em/><strong/>
      </Trans>
    }
    case QuestType.MultiWonderSum: {
      const q = quest as MultiWonderSumQuest
      const wonders = q.scoringWonders.map(w => t(`wonder.${wonderKey[w]}`))
      if (wonders.length === 1) {
        return <Trans i18nKey="help.quest.multi-wonder.one"
                      values={{ points: q.pointsPerWonder, wonder1: wonders[0] }}>
          <em/><strong/>
        </Trans>
      }
      return <Trans i18nKey="help.quest.multi-wonder.two"
                    values={{ points: q.pointsPerWonder, wonder1: wonders[0], wonder2: wonders[1] }}>
        <em/><strong/>
      </Trans>
    }
    case QuestType.Sacrifice: {
      const q = quest as SacrificeQuest
      return <Trans i18nKey="help.quest.sacrifice"
                    values={{ points: q.points, count: q.sanctuariesToSacrifice }}>
        <em/><strong/>
      </Trans>
    }
  }
}

const wonderKey: Record<Wonder, string> = {
  [Wonder.Rock]: 'rock',
  [Wonder.Chimera]: 'chimera',
  [Wonder.Thistle]: 'thistle'
}
