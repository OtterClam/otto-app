import TreasuryLayout from 'components/TreasuryLayout'
import Layout from 'Layout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app'
import ClamPond from 'views/treasury-pond/ClamPond'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const ClamPondPage: NextPageWithLayout = ClamPond

ClamPondPage.getLayout = (page, i18n) => {
  return (
    <Layout title={i18n.t('stake.title')}>
      <TreasuryLayout>{page}</TreasuryLayout>
    </Layout>
  )
}

export default ClamPondPage
