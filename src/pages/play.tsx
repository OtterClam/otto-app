import PlayView from 'views/play/PlayPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import DefaultLayout from 'layouts/DefaultLayout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const PlayPage: NextPageWithLayout = PlayView

PlayPage.getLayout = (page, i18n) => {
  return <DefaultLayout title={i18n.t('play.title')}>{page}</DefaultLayout>
}

export default PlayPage
