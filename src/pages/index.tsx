import HomeView from 'views/home/HomePage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Layout from 'Layout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const HomePage: NextPageWithLayout = HomeView

HomePage.getLayout = (page, i18n) => {
  return <Layout title={i18n.t('home.title')}>{page}</Layout>
}

export default HomePage
