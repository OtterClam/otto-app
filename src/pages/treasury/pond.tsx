import TreasuryLayout from 'components/TreasuryLayout'
import Layout from 'Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app'
import StakeView from 'views/treasury/stake/StakePage'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const TreasuryStakePage: NextPageWithLayout = StakeView

TreasuryStakePage.getLayout = (page, i18n) => {
  return (
    <Layout title={i18n.t('stake.title')}>
      <TreasuryLayout>{page}</TreasuryLayout>
    </Layout>
  )
}

export default TreasuryStakePage
