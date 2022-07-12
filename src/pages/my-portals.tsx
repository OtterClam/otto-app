import MyPortalsView from 'views/my-portals/MyPortalsPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Layout from 'Layout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MyPortalsPage: NextPageWithLayout = MyPortalsView

MyPortalsPage.getLayout = (page, i18n) => {
  return (
    <Layout title={i18n.t('my_portals.title')} requireConnect>
      {page}
    </Layout>
  )
}

export default MyPortalsPage
