/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const RevealHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.reveal')}</>
}