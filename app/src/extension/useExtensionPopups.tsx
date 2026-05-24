import { expansion1Regions, starrySkiesRegions } from '@gamepark/faraway/cards/Region'
import { baseGameSanctuaries, sanctuaries } from '@gamepark/faraway/cards/Sanctuary'
import { ReactNode, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { FarawayExtensionPopup } from './FarawayExtensionPopup'
import { useActiveExtensions } from './useActiveExtensions'

const expansion1Sanctuaries = sanctuaries.filter(s => !baseGameSanctuaries.includes(s))

/**
 * Builds the carousel slides for the active extensions. Returns an empty `popups`
 * array when no extension is active.
 *
 * The sessionStorage key for the framework's <ExtensionInfoDialog> is no longer
 * exposed here — the framework derives a default `${gameId}-extensions` itself,
 * which matches what we used to hardcode.
 */
export const useExtensionPopups = (): { popups: ReactNode[] } => {
  const { t } = useTranslation()
  const active = useActiveExtensions()
  return useMemo(() => {
    const popups: ReactNode[] = []
    if (active.expansion1) {
      popups.push(
        <FarawayExtensionPopup
          key="expansion1"
          eyebrow={t('extension.expansion1.eyebrow')}
          title={t('extension.expansion1.title')}
          description={<Trans i18nKey="extension.expansion1.desc"><strong/></Trans>}
          regions={expansion1Regions}
          sanctuaries={expansion1Sanctuaries}
        />
      )
    }
    if (active.starrySkies) {
      popups.push(
        <FarawayExtensionPopup
          key="starrySkies"
          eyebrow={t('extension.starrySkies.eyebrow')}
          title={t('extension.starrySkies.title')}
          description={<Trans i18nKey="extension.starrySkies.desc"><strong/></Trans>}
          regions={starrySkiesRegions}
          regionsPerRow={5}
          layout="compact"
        />
      )
    }
    return { popups }
  }, [active, t])
}
