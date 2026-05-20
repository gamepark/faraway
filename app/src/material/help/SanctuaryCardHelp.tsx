import { css } from '@emotion/react'
import { getColor } from '@gamepark/faraway/cards/Region'
import { Sanctuaries } from '@gamepark/faraway/cards/Sanctuaries'
import { Sanctuary } from '@gamepark/faraway/cards/Sanctuary'
import { SanctuaryQuests } from '@gamepark/faraway/cards/SanctuaryQuests'
import { Wonder } from '@gamepark/faraway/cards/Wonder'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { MaterialHelpProps, Picture, PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isMoveItemType, Location, MoveItem } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'
import { biomeIcon, clueIcon, nightIcon, wonderIcon } from './icons'
import { QuestHelp, ResourceEm } from './QuestHelp'

export const SanctuaryCardHelp = ({ item, itemIndex, closeDialog }: MaterialHelpProps) => {
  const { t } = useTranslation()
  return <>
    <h2>{t('help.sanctuary')}</h2>
    {item.location && <SanctuaryLocation location={item.location}/>}
    {itemIndex !== undefined && <SanctuaryButton itemIndex={itemIndex} closeDialog={closeDialog}/>}
    {item.id && <SanctuaryHelp sanctuary={item.id}/>}
  </>
}

const SanctuaryLocation = ({ location }: { location: Location }) => {
  const { t } = useTranslation()
  const rules = useRules<FarawayRules>()
  const playerId = usePlayerId()
  const player = usePlayerName(location.player)
  switch (location.type) {
    case LocationType.SanctuaryDeck:
      return <p>{t('help.sanctuary.deck', { number: rules?.material(MaterialType.Sanctuary).location(LocationType.SanctuaryDeck).length ?? 0 })}</p>
    case LocationType.PlayerSanctuaryHand:
      if (location.player === playerId) {
        return <p>{t('help.sanctuary.hand.you')}</p>
      } else {
        return <p>{t('help.sanctuary.hand.player', { player })}</p>
      }
    case LocationType.PlayerSanctuaryLine:
      if (location.player === playerId) {
        return <p>{t('help.sanctuary.placed.you')}</p>
      } else {
        return <p>{t('help.sanctuary.placed.player', { player })}</p>
      }
    default:
      return null
  }
}

const SanctuaryButton = ({ itemIndex, closeDialog }: { itemIndex: number, closeDialog: () => void }) => {
  const { t } = useTranslation()
  const move = useLegalMove<MoveItem>(move => isMoveItemType(MaterialType.Sanctuary)(move) && move.itemIndex === itemIndex)
  if (!move) return null
  return <p><PlayMoveButton move={move} onPlay={closeDialog}>{t('button.place')}</PlayMoveButton></p>
}

const SanctuaryHelp = ({ sanctuary }: { sanctuary: Sanctuary }) => {
  const { t } = useTranslation()
  const color = getColor(sanctuary)
  const { night, clue, wonders } = Sanctuaries[sanctuary] ?? {}
  const quest = SanctuaryQuests[sanctuary]
  return <>
    {quest && <p css={alignIcon}>
      <strong>{t('help.quest')}</strong>
      {' '}
      <QuestHelp quest={quest}/>
    </p>}
    {night &&
      <p css={alignIcon}>
        <Picture src={nightIcon}/>&nbsp;{t('help.night')}
      </p>
    }
    <>
      <p css={alignIcon}><Picture css={css`border-radius: 20%;`} src={biomeIcon[color]}/>&nbsp;<strong>{t(`biome.${color}`)}</strong></p>
      <p><em>{t('help.biome')}</em></p>
    </>
    {clue &&
      <p css={alignIcon}>
        <Picture src={clueIcon}/>&nbsp;<Trans i18nKey="help.clue"><strong/></Trans>
      </p>
    }
    {wonders && <>
      <p css={alignIcon}>
        {wonders.map((wonder, index) => <Picture key={index} src={wonderIcon[wonder]}/>)}
      </p>
      <p css={[alignIcon, tightTop]}>
        <Trans i18nKey="help.wonders">
          <strong/>
          <ResourceEm icon={wonderIcon[Wonder.Rock]}/>
          <ResourceEm icon={wonderIcon[Wonder.Chimera]}/>
          <ResourceEm icon={wonderIcon[Wonder.Thistle]}/>
          <em/>
        </Trans>
      </p>
    </>}
  </>
}


export const alignIcon = css`
  picture {
    display: contents;
  }

  /* !important forces our sizing over the framework's MaterialRulesDialog
     wrapper rule (\`p img { height: 1em; ... }\`) which has equal specificity
     and can win on cascade order, snap-shrinking icons on dialog close. */
  picture img,
  > img {
    vertical-align: middle;
    height: 1.5em !important;
    margin-right: 0.15em;
    transform: translateY(-0.1em) !important;
    position: static !important;
    top: auto !important;
  }
`

export const tightTop = css`
  margin-top: -0.4em;
`