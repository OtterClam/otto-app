import PortalView from 'views/my-portals/PortalPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps, GetStaticPaths } from 'next'
import { NextPageWithLayout } from 'pages/_app'
import Layout from 'Layout'
import Board, { Background } from 'components/Board'

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

PortalPage.getLayout = (page, i18n) => {
  return (
    <Layout title={i18n.t('my_portals.title')}>
      <Board background={Background.White}>{page}</Board>
    </Layout>
  )
}

export default PortalPage
