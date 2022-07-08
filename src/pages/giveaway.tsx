import Board from 'components/Board'
import GiveawayView from 'views/giveaway/GiveawayPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Layout from 'Layout'
import { useTranslation } from 'next-i18next'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const GiveawayPage: NextPageWithLayout = GiveawayView

GiveawayPage.getLayout = page => {
  const { t } = useTranslation('', { keyPrefix: 'giveaway' })

  return (
    <Layout title={t('title')}>
      <Board>{page}</Board>
    </Layout>
  )
}

export default GiveawayPage
