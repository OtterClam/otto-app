import Board from 'components/Board'
import OttoView from 'views/otto/OttoPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps, GetStaticPaths } from 'next'
import { NextPageWithLayout } from 'pages/_app'
import DefaultLayout from 'layouts/DefaultLayout'
import { LeaderboardEpochProvider } from 'contexts/LeaderboardEpoch'
import { RarityEpochProvider } from 'contexts/RarityEpoch'
import AdventureProvider from 'AdventureProvider'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const OttoPage: NextPageWithLayout = OttoView

OttoPage.getLayout = (page, i18n) => {
  return (
    <DefaultLayout title={i18n.t('otto.title')}>
      <RarityEpochProvider>
        <LeaderboardEpochProvider>
          <AdventureProvider>
            <Board>{page}</Board>
          </AdventureProvider>
        </LeaderboardEpochProvider>
      </RarityEpochProvider>
    </DefaultLayout>
  )
}

export default OttoPage
