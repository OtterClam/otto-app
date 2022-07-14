import TreasuryLayout from 'components/TreasuryLayout'
import Layout from 'Layout'
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
    <Layout title={i18n.t('treasury.dashboard.title')} noBorder requireConnect>
      <TreasuryLayout>{page}</TreasuryLayout>
    </Layout>
  )
}

export default TreasuryDashboardPage
