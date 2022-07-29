import TreasuryLayout from 'components/TreasuryLayout'
import Layout from 'Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app'
import TreasuryDashboardView from 'views/treasury-dashboard'
import RequireConnect from 'components/RequireConnect'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const TreasuryDashboardPage: NextPageWithLayout = TreasuryDashboardView

TreasuryDashboardPage.getLayout = (page, i18n) => {
  return (
    <Layout title={i18n.t('treasury.dashboard.title')}>
      <TreasuryLayout>{page}</TreasuryLayout>
    </Layout>
  )
}

export default TreasuryDashboardPage
