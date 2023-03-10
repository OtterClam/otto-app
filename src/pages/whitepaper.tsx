import Board, { Background } from 'components/Board'
import WhitepaperView from 'views/whitepaper'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import IFrameLayout from 'layouts/IFrameLayout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const WhitepaperPage: NextPageWithLayout = WhitepaperView

WhitepaperPage.getLayout = (page, i18n) => {
  return (
    <IFrameLayout title={i18n.t('floatingNavButtons.whitepaper')}>
      {page}
    </IFrameLayout>
  )
}

export default WhitepaperPage