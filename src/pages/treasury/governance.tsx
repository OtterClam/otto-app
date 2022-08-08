import TreasuryLayout from 'components/TreasuryLayout'
import Layout from 'Layout'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app'
import GovernancePageView from 'views/treasury/governance'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const GovernancePage: NextPageWithLayout = GovernancePageView

GovernancePage.getLayout = page => {
  const { t } = useTranslation()

  return (
    <Layout title={t('treasury.governance.title')}>
      <TreasuryLayout>{page}</TreasuryLayout>
    </Layout>
  )
}

export default GovernancePage
