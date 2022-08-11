import TreasuryLayout from 'layouts/TreasuryLayout'
import DefaultLayout from 'layouts/DefaultLayout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app'
import GovernancePageView from 'views/treasury/governance'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const GovernancePage: NextPageWithLayout = GovernancePageView

GovernancePage.getLayout = (page, i18n) => {
  return (
    <DefaultLayout title={i18n.t('treasury.governance.title')}>
      <TreasuryLayout>{page}</TreasuryLayout>
    </DefaultLayout>
  )
}

export default GovernancePage
