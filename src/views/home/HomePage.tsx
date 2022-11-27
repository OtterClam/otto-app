import { useBreakpoints } from 'contexts/Breakpoints'
import useAssetsBundles from 'hooks/useAssetsBundles'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { BundleName } from 'worker/consts'
import DesktopHomePage from './DesktopHomePage'
import MobileHomePage from './MobileHomePage'

export default function HomePage() {
  const { t } = useTranslation()
  const { isTablet, isMobile, isDesktop } = useBreakpoints()
  const desktopVersion = !(isTablet || isMobile || isDesktop)

  useAssetsBundles([BundleName.HomePage])

  return (
    <>
      <Head>
        <title>{t('home.docTitle')}</title>
        <meta property="og:title" content={t('home.docTitle')} />
        <meta name="description" content={t('home.docDesc')} />
        <meta property="og:description" content={t('home.docDesc')} />
        <meta property="og:image" content="/og.jpg" />
      </Head>
      {desktopVersion && <DesktopHomePage />}
      {!desktopVersion && <MobileHomePage />}
    </>
  )
}
