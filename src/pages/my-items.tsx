import Board from 'components/Board'
import MyItemsView from 'views/my-items/MyItemsPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Layout from 'Layout'
import RequireConnect from 'components/RequireConnect'
import { useTranslation } from 'next-i18next'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MyItemsPage: NextPageWithLayout = MyItemsView

MyItemsPage.getLayout = page => {
  const { t } = useTranslation('', { keyPrefix: 'my_items' })

  return (
    <Layout title={t('title')}>
      <Board>
        <RequireConnect>{page}</RequireConnect>
      </Board>
    </Layout>
  )
}

export default MyItemsPage
