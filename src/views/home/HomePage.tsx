import AdventureShareMeta from 'components/AdventureShareMeta'
import { useBreakpoints } from 'contexts/Breakpoints'
import useAssetsBundles from 'hooks/useAssetsBundles'
import useSharedAdventureResult from 'hooks/useSharedAdventureResult'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { ServerSideAdventureShare } from 'utils/adventure'
import { BundleName } from 'worker/consts'
import DesktopHomePage from './DesktopHomePage'
import MobileHomePage from './MobileHomePage'

export default function HomePage({ adventure }: { adventure?: ServerSideAdventureShare }) {
  const { t } = useTranslation()
  const { isTablet, isMobile, isDesktop } = useBreakpoints()
  const desktopVersion = !(isTablet || isMobile || isDesktop)

  useSharedAdventureResult()
  useAssetsBundles([BundleName.HomePage])

  return (
    <>
      <AdventureShareMeta adventure={adventure}>
        <title>{t('home.docTitle')}</title>
        <meta property="og:title" content={t('home.docTitle')} />
        <meta name="description" content={t('home.docDesc')} />
        <meta property="og:description" content={t('home.docDesc')} />
        <meta property="og:image" content="/og.jpg" />
      </AdventureShareMeta>
      {desktopVersion && <DesktopHomePage />}
      {!desktopVersion && <MobileHomePage />}
    </>
  )
}
