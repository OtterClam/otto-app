import PlayView from 'views/play/PlayPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import Layout from 'Layout'
import { useTranslation } from 'next-i18next'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const PlayPage: NextPageWithLayout = PlayView

PlayPage.getLayout = page => {
  const { t } = useTranslation()

  return <Layout title={t('play.title')}>{page}</Layout>
}

export default PlayPage
