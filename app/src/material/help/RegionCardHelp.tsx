/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { CardDescription } from '@gamepark/faraway/cards/CardDescription'
import { Color } from '@gamepark/faraway/cards/Color'
import { getColor, getValue, Region } from '@gamepark/faraway/cards/Region'
import { Regions } from '@gamepark/faraway/cards/Regions'
import { Wonder } from '@gamepark/faraway/cards/Wonder'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'
import autumn from '../../images/icon/autumn.jpg'
import chimera from '../../images/icon/chimera.png'
import clueIcon from '../../images/icon/clue.png'
import rock from '../../images/icon/rock.png'
import spring from '../../images/icon/spring.jpg'
import summer from '../../images/icon/summer.jpg'
import thistle from '../../images/icon/thistle.png'
import winter from '../../images/icon/winter.jpg'
import nightIcon from '../../images/time/night.png'

export const RegionCardHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const number = item.id ? getValue(item.id) : ''
  return <>
    <h2>{t('help.region', { number })}</h2>
    {item.id && <RegionHelp region={item.id}/>}
  </>
}

const RegionHelp = ({ region }: { region: Region }) => {
  const { t } = useTranslation()
  const number = getValue(region)
  const color = getColor(region)
  const { night, clue, wonders } = Regions[region] as CardDescription
  return <>
    <p><strong>{t('help.time', { number })}</strong></p>
    <p><em>{t('help.time.detail')}</em></p>
    {night &&
      <p css={alignIcon}>
        <Picture src={nightIcon}/>&nbsp;{t('help.night')}
      </p>
    }
    <p css={alignIcon}><Picture css={css`border-radius: 20%;`} src={biomeIcon[color]}/>&nbsp;<strong>{t(`biome.${color}`)}</strong></p>
    <p><em>{t('help.biome')}</em></p>
    {clue &&
      <p css={alignIcon}>
        <Picture src={clueIcon}/>&nbsp;<Trans defaults="help.clue"><strong/></Trans>
      </p>
    }
    {wonders &&
      <p css={alignIcon}>
        {wonders.map(wonder => <Picture src={wonderIcon[wonder]}/>)}&nbsp;<Trans defaults="help.wonders"><strong/><em/></Trans>
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