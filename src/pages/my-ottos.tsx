import Board from 'components/Board'
import MyOttosView from 'views/otto/MyOttosPage/MyOttosPage'
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

const MyOttosPage: NextPageWithLayout = MyOttosView

MyOttosPage.getLayout = page => {
  const { t } = useTranslation()

  return (
    <Layout title={t('my_ottos.title')}>
      <Board>
        <RequireConnect>{page}</RequireConnect>
      </Board>
    </Layout>
  )
}

export default MyOttosPage
