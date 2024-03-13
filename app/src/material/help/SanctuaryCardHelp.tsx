/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Color } from '@gamepark/faraway/cards/Color'
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
import chimera from '../../images/icon/chimera.png'
import autumn from '../../images/icon/City.jpg'
import clueIcon from '../../images/icon/clue.png'
import winter from '../../images/icon/Desert.jpg'
import summer from '../../images/icon/Forest.jpg'
import spring from '../../images/icon/River.jpg'
import rock from '../../images/icon/rock.png'
import thistle from '../../images/icon/thistle.png'
import nightIcon from '../../images/time/night.png'
import { QuestHelp } from './QuestHelp'

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
    {color < 5 && <>
      <p css={alignIcon}><Picture css={css`border-radius: 20%;`} src={biomeIcon[color]}/>&nbsp;<strong>{t(`biome.${color}`)}</strong></p>
      <p><em>{t('help.biome')}</em></p>
    </>}
    {clue &&
      <p css={alignIcon}>
        <Picture src={clueIcon}/>&nbsp;<Trans defaults="help.clue"><strong/></Trans>
      </p>
    }
    {wonders &&
      <p css={alignIcon}>
        {wonders.map((wonder, index) => <Picture key={index} src={wonderIcon[wonder]}/>)}&nbsp;<Trans defaults="help.wonders"><strong/><em/></Trans>
      </p>
    }
  </>
}

const biomeIcon = {
  [Color.Green]: spring,
  [Color.Red]: summer,
  [Color.Yellow]: autumn,
  [Color.Blue]: winter
}

const wonderIcon = {
  [Wonder.Rock]: rock,
  [Wonder.Chimera]: chimera,
  [Wonder.Thistle]: thistle
}

export const alignIcon = css`
  > * {
    vertical-align: middle;
  }

  picture, img {
    vertical-align: middle;
    height: 1.5em;
    margin-right: 0.1em;
  }
`