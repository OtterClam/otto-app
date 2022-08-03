import Board from 'components/Board'
import MyOttosView from 'views/otto/MyOttosPage/MyOttosPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import DefaultLayout from 'layouts/DefaultLayout'
import RequireConnect from 'components/RequireConnect'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MyOttosPage: NextPageWithLayout = MyOttosView

MyOttosPage.getLayout = (page, i18n) => {
  return (
    <DefaultLayout title={i18n.t('my_ottos.title')}>
      <Board>
        <RequireConnect>{page}</RequireConnect>
      </Board>
    </DefaultLayout>
  )
}

export default MyOttosPage
