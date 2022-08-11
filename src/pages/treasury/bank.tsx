import TreasuryLayout from 'layouts/TreasuryLayout'
import DefaultLayout from 'layouts/DefaultLayout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app'
import TreasuryBankView from 'views/treasury-bank'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const TreasuryDashboardPage: NextPageWithLayout = TreasuryBankView

TreasuryDashboardPage.getLayout = (page, i18n) => {
  return (
    <DefaultLayout title={i18n.t('treasury.dashboard.title')}>
      <TreasuryLayout>{page}</TreasuryLayout>
    </DefaultLayout>
  )
}

export default TreasuryDashboardPage
