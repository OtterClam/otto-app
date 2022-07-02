import LeaderboardView from 'views/leaderboard/LeaderboardPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import Layout from 'Layout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const LeaderBoardPage: NextPageWithLayout = LeaderboardView

LeaderBoardPage.getLayout = page => {
  const { t } = useTranslation()

  return (
    <Layout title={t('mint.mint.title')} background="dark">
      {page}
    </Layout>
  )
}

export default LeaderBoardPage
