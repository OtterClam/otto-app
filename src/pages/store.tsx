import Board, { Background } from 'components/Board'
import StoreView from 'views/store/StorePage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Layout from 'Layout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const StorePage: NextPageWithLayout = StoreView

StorePage.getLayout = (page, i18n) => {
  return (
    <Layout title={i18n.t('store.title')}>
      <Board background={Background.Dark}>{page}</Board>
    </Layout>
  )
}

export default StorePage
