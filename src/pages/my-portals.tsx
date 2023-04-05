import Board from 'components/Board'
import MyPortalsView from 'views/my-portals/MyPortalsPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { GetStaticProps } from 'next'
import DefaultLayout from 'layouts/DefaultLayout'
import RequireConnect from 'components/RequireConnect'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MyPortalsPage: NextPageWithLayout = MyPortalsView

MyPortalsPage.getLayout = (page, i18n) => {
  const docTitle = i18n.t('my_portals.docTitle')

  return (
    <DefaultLayout title={i18n.t('my_portals.title')} docTitle={docTitle}>
      <Board>
        <RequireConnect>{page}</RequireConnect>
      </Board>
    </DefaultLayout>
  )
}

export default MyPortalsPage
