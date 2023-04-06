import Board from 'components/Board'
import MyItemsView from 'views/my-items/MyItemsPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { GetStaticProps } from 'next'
import DefaultLayout from 'layouts/DefaultLayout'
import RequireConnect from 'components/RequireConnect'
import { LeaderboardEpochProvider } from 'contexts/LeaderboardEpoch'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MyItemsPage: NextPageWithLayout = MyItemsView

MyItemsPage.getLayout = (page, i18n) => {
  const docTitle = i18n.t('my_items.docTitle')

  return (
    <DefaultLayout title={i18n.t('my_items.title')} docTitle={docTitle}>
      <Board>
        <RequireConnect>
          <LeaderboardEpochProvider>{page}</LeaderboardEpochProvider>
        </RequireConnect>
      </Board>
    </DefaultLayout>
  )
}

export default MyItemsPage
