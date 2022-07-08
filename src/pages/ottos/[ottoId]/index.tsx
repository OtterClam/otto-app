import Board from 'components/Board'
import OttoView from 'views/otto/OttoPage'
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

const OttoPage: NextPageWithLayout = OttoView

OttoPage.getLayout = page => {
  const { t } = useTranslation()
  return (
    <Layout title={t('otto.title')}>
      <Board>{page}</Board>
    </Layout>
  )
}

export default OttoPage
