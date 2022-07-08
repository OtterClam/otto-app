import Board from 'components/Board'
import MyPortalsView from 'views/my-portals/MyPortalsPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import Layout from 'Layout'
import RequireConnect from 'components/RequireConnect'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MyPortalsPage: NextPageWithLayout = MyPortalsView

MyPortalsPage.getLayout = page => {
  const { t } = useTranslation()

  return (
    <Layout title={t('my_portals.title')}>
      <Board>
        <RequireConnect>{page}</RequireConnect>
      </Board>
    </Layout>
  )
}

export default MyPortalsPage
