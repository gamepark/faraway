/** @jsxImportSource @emotion/react */
import { useTranslation } from 'react-i18next'

export const DealSanctuariesHeader = () => {
  const { t } = useTranslation()
  return <>{t('header.deal-sanctuaries')}</>
}