import { expansion1Regions, starrySkiesRegions } from '@gamepark/faraway/cards/Region'
import { baseGameSanctuaries, sanctuaries } from '@gamepark/faraway/cards/Sanctuary'
import { ReactNode, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { FarawayExtensionPopup } from './FarawayExtensionPopup'
import { useActiveExtensions } from './useActiveExtensions'

const expansion1Sanctuaries = sanctuaries.filter(s => !baseGameSanctuaries.includes(s))

/**
 * Builds the carousel slides + the sessionStorage key passed to the framework's
 * `<ExtensionInfoDialog>`. Returns an empty `popups` array when no extension is active.
 */
export const useExtensionPopups = (): { popups: ReactNode[]; storageKey: string } => {
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
    // Single constant key — the storageKey only gates auto-open ("show
    // once per tab session"). When the user changes the extension combo
    // they reload the page anyway, which already resets sessionStorage,
    // so we don't need to encode the combo in the key.
    const storageKey = 'faraway-extensions'
    return { popups, storageKey }
  }, [active, t])
}
