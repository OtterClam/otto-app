import Board, { Background } from 'components/Board'
import LeaderboardView from 'views/leaderboard/LeaderboardPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import DefaultLayout from 'layouts/DefaultLayout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const LeaderBoardPage: NextPageWithLayout = LeaderboardView

LeaderBoardPage.getLayout = (page, i18n) => {
  return (
    <DefaultLayout title={i18n.t('leaderboard.title')}>
      <Board background={Background.Dark}>{page}</Board>
    </DefaultLayout>
  )
}

export default LeaderBoardPage
