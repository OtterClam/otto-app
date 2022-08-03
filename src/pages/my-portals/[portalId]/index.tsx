import PortalView from 'views/my-portals/PortalPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps, GetStaticPaths } from 'next'
import { NextPageWithLayout } from 'pages/_app'
import DefaultLayout from 'layouts/DefaultLayout'
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
    <DefaultLayout title={i18n.t('my_portals.title')}>
      <Board background={Background.White}>{page}</Board>
    </DefaultLayout>
  )
}

export default PortalPage
