import AdventureView from 'views/adventure'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'
import GameLayout from 'layouts/GameLayout'
import AdventureProvider from 'AdventureProvider'
import { serverSideAdventureShare } from 'utils/adventure'
import { NextPageWithLayout } from './_app'

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
    ...(await serverSideAdventureShare(query)),
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
