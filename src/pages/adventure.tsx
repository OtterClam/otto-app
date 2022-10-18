import AdventureView from 'views/adventure'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import GameLayout from 'layouts/GameLayout'
import AdventureProvider from 'AdventureProvider'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const AdventurePage: NextPageWithLayout = AdventureView

AdventurePage.getLayout = (page, i18n) => {
  return (
    <GameLayout title={i18n.t('adventure.title')}>
      <AdventureProvider>{page}</AdventureProvider>
    </GameLayout>
  )
}

export default AdventurePage
