import OttoView from 'views/otto/OttoPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps, GetStaticPaths } from 'next'
import { NextPageWithLayout } from 'pages/_app'
import Layout from 'Layout'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const OttoPage: NextPageWithLayout = OttoView

OttoPage.getLayout = (page, i18n) => {
  return <Layout title={i18n.t('otto.title')}>{page}</Layout>
}

export default OttoPage
