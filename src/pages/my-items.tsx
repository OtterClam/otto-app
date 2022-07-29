import Board from 'components/Board'
import MyItemsView from 'views/my-items/MyItemsPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Layout from 'Layout'
import RequireConnect from 'components/RequireConnect'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MyItemsPage: NextPageWithLayout = MyItemsView

MyItemsPage.getLayout = (page, i18n) => {
  return (
    <Layout title={i18n.t('my_items.title')}>
      <Board>
        <RequireConnect>{page}</RequireConnect>
      </Board>
    </Layout>
  )
}

export default MyItemsPage
