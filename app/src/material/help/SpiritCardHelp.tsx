import { css } from '@emotion/react'
import { getCriterionColor, getCriterionWonder } from '@gamepark/faraway/cards/CardCounting'
import { Criterion } from '@gamepark/faraway/cards/Criterion'
import { Spirit } from '@gamepark/faraway/cards/Spirit'
import { Spirits } from '@gamepark/faraway/cards/Spirits'
import { Wonder } from '@gamepark/faraway/cards/Wonder'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { SpiritHelper } from '@gamepark/faraway/rules/helper/SpiritHelper'
import { MaterialHelpProps, Picture, PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isMoveItemType, Location, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { biomeIcon, clueIcon, nightIcon, noResourceIcon, spiritIcon, wonderIcon } from './icons'
import { ResourceEm } from './QuestHelp'
import { alignIcon, tightTop } from './RegionCardHelp'

export const SpiritCardHelp = ({ item, itemIndex, closeDialog }: MaterialHelpProps) => {
  const { t } = useTranslation()
  return <>
    <h2>{item.id ? t(`spirit.${item.id}`) : t('help.spirit')}</h2>
    {item.location && <SpiritLocation location={item.location}/>}
    {itemIndex !== undefined && <TakeSpiritButton itemIndex={itemIndex} closeDialog={closeDialog}/>}
    {itemIndex !== undefined && item.location?.type === LocationType.AvailableSpirit && <BlockedSpirit itemIndex={itemIndex}/>}
    {item.id && <SpiritHelp spirit={item.id}/>}
  </>
}

const SpiritLocation = ({ location }: { location: Location }) => {
  const { t } = useTranslation()
  const rules = useRules<FarawayRules>()
  const playerId = usePlayerId()
  const player = usePlayerName(location.player)
  switch (location.type) {
    case LocationType.SpiritDeck:
      return <p>{t('help.spirit.deck', { number: rules?.material(MaterialType.Spirit).location(LocationType.SpiritDeck).length ?? 0 })}</p>
    case LocationType.AvailableSpirit:
      return <p>{t('help.spirit.available')}</p>
    case LocationType.PlayerSpirit:
      if (location.player === playerId) {
        return <p>{t('help.spirit.placed.you')}</p>
      } else {
        return <p>{t('help.spirit.placed.player', { player })}</p>
      }
    default:
      return null
  }
}

const TakeSpiritButton = ({ itemIndex, closeDialog }: { itemIndex: number, closeDialog: () => void }) => {
  const { t } = useTranslation()
  const move = useLegalMove<MoveItem>(move => isMoveItemType(MaterialType.Spirit)(move) && move.itemIndex === itemIndex)
  if (!move) return null
  return <p><PlayMoveButton move={move} onPlay={closeDialog}>{t('button.spirit.take')}</PlayMoveButton></p>
}

const BlockedSpirit = ({ itemIndex }: { itemIndex: number }) => {
  const rules = useRules<FarawayRules>()
  const playerId = usePlayerId()
  if (!rules || playerId === undefined || !new SpiritHelper(rules.game).isBlocked(itemIndex, playerId)) return null
  return <p><em><Trans i18nKey="help.spirit.blocked"/></em></p>
}

const SpiritHelp = ({ spirit }: { spirit: Spirit }) => {
  const { t } = useTranslation()
  const { condition, points, bonus, wonders, clue, night } = Spirits[spirit]
  return <>
    <p css={alignIcon}>
      <strong>{t('help.spirit.condition.title')}</strong>
      {' '}
      <Trans i18nKey="help.spirit.condition" values={{ count: condition.count }}>
        <CriterionEm criterion={condition.criterion} count={condition.count}/>
      </Trans>
    </p>
    <p css={alignIcon}>
      <strong>{t('help.spirit.points.title')}</strong>
      {' '}
      {!!points && <Trans i18nKey="help.quest.points" values={{ points }}><em/></Trans>}
      {!!points && !!bonus && ' '}
      {bonus && <Trans i18nKey={points ? 'help.spirit.bonus.plus' : 'help.spirit.bonus'} values={{ points: bonus.points }}>
        <CriterionEm criterion={bonus.criterion} count={1}/>
      </Trans>}
    </p>
    {(!!wonders?.length || !!clue || !!night) && <>
      <p css={alignIcon}>
        <strong>{t('help.spirit.resources.title')}</strong>
        {' '}
        {wonders?.map((wonder, index) => <Picture key={index} src={wonderIcon[wonder]}/>)}
        {Array.from({ length: clue ?? 0 }, (_, index) => <Picture key={`clue-${index}`} src={clueIcon}/>)}
        {Array.from({ length: night ?? 0 }, (_, index) => <Picture key={`night-${index}`} src={nightIcon}/>)}
      </p>
      <p css={[tightTop]}><em>{t('help.spirit.resources')}</em></p>
    </>}
    <p><em>{t('help.spirit.rules')}</em></p>
  </>
}

export const CriterionEm: FC<{ criterion: Criterion, count: number }> = ({ criterion, count }) => {
  const { t } = useTranslation()
  const color = getCriterionColor(criterion)
  if (color !== undefined) {
    return <ResourceEm icon={biomeIcon[color]}>{t('help.criterion.color', { count, biome: t(`biome.${color}`) })}</ResourceEm>
  }
  const wonder = getCriterionWonder(criterion)
  if (wonder !== undefined) {
    return <ResourceEm icon={wonderIcon[wonder]}>{t(`help.criterion.${wonderKey[wonder]}`, { count })}</ResourceEm>
  }
  switch (criterion) {
    case Criterion.Clue:
      return <ResourceEm icon={clueIcon}>{t('help.criterion.clue', { count })}</ResourceEm>
    case Criterion.Night:
      return <ResourceEm icon={nightIcon}>{t('help.criterion.night', { count })}</ResourceEm>
    case Criterion.NoResourceCard:
      return <ResourceEm icon={noResourceIcon}>{t('help.criterion.no-resource', { count })}</ResourceEm>
    case Criterion.ShortExploration:
      return <em css={plainEmCss}>{t('help.criterion.short', { count })}</em>
    case Criterion.LongExploration:
      return <em css={plainEmCss}>{t('help.criterion.long', { count })}</em>
    case Criterion.Spirit:
      return <ResourceEm icon={spiritIcon}>{t('help.criterion.spirit', { count })}</ResourceEm>
    default:
      return null
  }
}

const wonderKey: Record<Wonder, string> = {
  [Wonder.Rock]: 'rock',
  [Wonder.Chimera]: 'chimera',
  [Wonder.Thistle]: 'thistle'
}

const plainEmCss = css`
  font-style: normal;
  font-weight: 700;
`
