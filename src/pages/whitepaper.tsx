import Board, { Background } from 'components/Board'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import IFrameLayout from 'layouts/IFrameLayout'
import IFrameView from 'views/iframe'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const WhitepaperPage: NextPageWithLayout = () => {
  return <IFrameView src="https://docs.ottopia.app/ottopia" scrolling="yes" />
}

WhitepaperPage.getLayout = (page, i18n) => {
  return <IFrameLayout title={i18n.t('floatingNavButtons.whitepaper')}>{page}</IFrameLayout>
}

export default WhitepaperPage
