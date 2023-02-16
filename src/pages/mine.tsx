import DefaultLayout from 'layouts/DefaultLayout'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app'
import MineView from 'views/mine'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MinePage: NextPageWithLayout = MineView

MinePage.getLayout = (page, i18n) => {
  return <DefaultLayout title={i18n.t('mine.title')}>{page}</DefaultLayout>
}

export default MinePage
