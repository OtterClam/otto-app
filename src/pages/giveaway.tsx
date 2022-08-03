import Board from 'components/Board'
import GiveawayView from 'views/giveaway/GiveawayPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import DefaultLayout from 'layouts/DefaultLayout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const GiveawayPage: NextPageWithLayout = GiveawayView

GiveawayPage.getLayout = (page, i18n) => {
  return (
    <DefaultLayout title={i18n.t('giveaway.title')}>
      <Board>{page}</Board>
    </DefaultLayout>
  )
}

export default GiveawayPage
