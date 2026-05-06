import { Trans, useTranslation } from 'react-i18next'

export const ScoreSheetHelp = () => {
  const { t } = useTranslation()
  return <>
    <h2>{t('help.score-sheet')}</h2>
    <p>
      <Trans i18nKey="help.scoring"><strong/><em/></Trans>
    </p>
  </>
}
