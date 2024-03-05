/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const ScoringHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.scoring')}</>
}