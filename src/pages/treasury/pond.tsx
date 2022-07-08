import TreasuryLayout from 'components/TreasuryLayout'
import Layout from 'Layout'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app'
import StakeView from 'views/treasury/stake/StakePage'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const TreasuryStakePage: NextPageWithLayout = StakeView

TreasuryStakePage.getLayout = page => {
  const { t } = useTranslation()

  return (
    <Layout title={t('stake.title')}>
      <TreasuryLayout>{page}</TreasuryLayout>
    </Layout>
  )
}

export default TreasuryStakePage
