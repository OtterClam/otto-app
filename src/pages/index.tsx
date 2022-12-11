import HomeView from 'views/home/HomePage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps, GetStaticProps } from 'next'
import GameLayout from 'layouts/GameLayout'
import NotificationCenterProvider from 'contexts/NotificationCenter'
import AdventureProvider from 'AdventureProvider'
import { serverSideAdventureShare } from 'utils/adventure'
import { NextPageWithLayout } from './_app'

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
    ...(await serverSideAdventureShare(query)),
  },
})

const HomePage: NextPageWithLayout = HomeView

HomePage.getLayout = (page, i18n) => {
  return (
    <GameLayout title={i18n.t('home.title')}>
      <AdventureProvider>
        <NotificationCenterProvider>{page}</NotificationCenterProvider>
      </AdventureProvider>
    </GameLayout>
  )
}

export default HomePage
