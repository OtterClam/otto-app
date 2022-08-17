import TreasuryLayout from 'layouts/TreasuryLayout'
import DefaultLayout from 'layouts/DefaultLayout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app'
import PalacePageView from 'views/treasury-palace'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const PalacePage: NextPageWithLayout = PalacePageView

PalacePage.getLayout = (page, i18n) => {
  return (
    <DefaultLayout title={i18n.t('treasury.palace.title')}>
      <TreasuryLayout>{page}</TreasuryLayout>
    </DefaultLayout>
  )
}

export default PalacePage
