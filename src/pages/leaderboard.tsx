import Board, { Background } from 'components/Board'
import LeaderboardView from 'views/leaderboard/LeaderboardPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import DefaultLayout from 'layouts/DefaultLayout'
import { LeaderboardEpochProvider } from 'contexts/LeaderboardEpoch'
import { RarityEpochProvider } from 'contexts/RarityEpoch'
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
      <RarityEpochProvider>
        <LeaderboardEpochProvider>
          <Board background={Background.Dark}>{page}</Board>
        </LeaderboardEpochProvider>
      </RarityEpochProvider>
    </DefaultLayout>
  )
}

export default LeaderBoardPage
