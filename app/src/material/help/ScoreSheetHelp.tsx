/** @jsxImportSource @emotion/react */
import { Trans, useTranslation } from 'react-i18next'

export const ScoreSheetHelp = () => {
  const { t } = useTranslation()
  return <>
    <h2>{t('help.score-sheet')}</h2>
    <p>
      <Trans defaults="help.scoring"><strong/><em/></Trans>
    </p>
  </>
}
