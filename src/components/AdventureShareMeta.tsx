import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { PropsWithChildren } from 'react'
import { ServerSideAdventureShare } from 'utils/adventure'

export default function AdventureShareMeta({
  adventure,
  children,
}: PropsWithChildren<{ adventure?: ServerSideAdventureShare }>) {
  const { t } = useTranslation()
  return (
    <Head>
      {adventure && (
        <>
          <title>
            {t('adventurePopup.resultStep.og_title', {
              name: adventure.otto.name,
              result: t(
                adventure.result.success
                  ? 'adventurePopup.resultStep.og_succeeded'
                  : 'adventurePopup.resultStep.og_failed'
              ),
              location: adventure.location.name,
            })}
          </title>
          <meta
            property="description"
            content={t('adventurePopup.resultStep.og_description', {
              name: adventure.otto.name,
              location: adventure.location.name,
            })}
          />
          <meta
            property="og:title"
            content={t('adventurePopup.resultStep.og_title', {
              name: adventure.otto.name,
              result: t(
                adventure.result.success
                  ? 'adventurePopup.resultStep.og_succeeded'
                  : 'adventurePopup.resultStep.og_failed'
              ),
              location: adventure.location.name,
            })}
          />
          <meta
            property="og:description"
            content={t('adventurePopup.resultStep.og_description', {
              name: adventure.otto.name,
              location: adventure.location.name,
            })}
          />
          <meta property="og:image" content={adventure.result.image} />
        </>
      )}
      {!adventure && children}
    </Head>
  )
}
