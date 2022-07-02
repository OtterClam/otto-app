import HomeView from 'views/home/HomePage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Layout from 'Layout'
import { useTranslation } from 'next-i18next'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const HomePage: NextPageWithLayout = HomeView

HomePage.getLayout = page => {
  const { t } = useTranslation()
  return (
    <Layout title={t('home.title')} noBorder>
      {page}
    </Layout>
  )
}

export default HomePage
