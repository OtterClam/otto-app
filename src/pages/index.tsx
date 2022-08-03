import HomeView from 'views/home/HomePage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import GameLayout from 'layouts/GameLayout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const HomePage: NextPageWithLayout = HomeView

HomePage.getLayout = (page, i18n) => {
  return <GameLayout title={i18n.t('home.title')}>{page}</GameLayout>
}

export default HomePage
