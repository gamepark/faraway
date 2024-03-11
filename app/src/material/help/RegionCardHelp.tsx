/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { CardDescription } from '@gamepark/faraway/cards/CardDescription'
import { Color } from '@gamepark/faraway/cards/Color'
import { getColor, getValue } from '@gamepark/faraway/cards/Region'
import { Regions } from '@gamepark/faraway/cards/Regions'
import { Wonder } from '@gamepark/faraway/cards/Wonder'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'
import autumn from '../../images/icon/autumn.jpg'
import chimera from '../../images/icon/chimera.png'
import clue from '../../images/icon/clue.png'
import rock from '../../images/icon/rock.png'
import spring from '../../images/icon/spring.jpg'
import summer from '../../images/icon/summer.jpg'
import thistle from '../../images/icon/thistle.png'
import winter from '../../images/icon/winter.jpg'
import night from '../../images/time/night.png'

export const RegionCardHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const number = getValue(item.id)
  const color = getColor(item.id)
  const region = Regions[item.id] as CardDescription
  return <>
    <h2>{t('help.region', { number })}</h2>
    <p><strong>{t('help.time', { number })}</strong></p>
    <p><em>{t('help.time.detail')}</em></p>
    {region.night &&
      <p css={alignIcon}>
        <Picture src={night}/>&nbsp;{t('help.night')}
      </p>
    }
    <p css={alignIcon}><Picture css={css`border-radius: 20%;`} src={biomeIcon[color]}/>&nbsp;<strong>{t(`biome.${color}`)}</strong></p>
    <p><em>{t('help.biome')}</em></p>
    {region.clue &&
      <p css={alignIcon}>
        <Picture src={clue}/>&nbsp;<Trans defaults="help.clue"><strong/></Trans>
      </p>
    }
    {region.wonders &&
      <p css={alignIcon}>
        {region.wonders.map(wonder => <Picture src={wonderIcon[wonder]}/>)}&nbsp;<Trans defaults="help.wonders"><strong/><em/></Trans>
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