import PortalView from 'views/my-portals/PortalPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps, GetStaticPaths } from 'next'
import { NextPageWithLayout } from 'pages/_app'
import Layout from 'Layout'
import { useTranslation } from 'next-i18next'

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

const PortalPage: NextPageWithLayout = PortalView

PortalPage.getLayout = page => {
  const { t } = useTranslation()
  return <Layout title={t('my_portals.title')}>{page}</Layout>
}

export default PortalPage
