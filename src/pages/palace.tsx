import Board, { Background } from 'components/Board'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import IFrameLayout from 'layouts/IFrameLayout'
import { NextPageWithLayout } from './_app'
import { PalaceView } from 'views/iframe'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const PalacePage: NextPageWithLayout = () => {
  return (
    <PalaceView />
  )
}

PalacePage.getLayout = (page, i18n) => {
  return (
    <IFrameLayout title={i18n.t('treasury.palace.title')}>
      {page}
    </IFrameLayout>
  )
}

export default PalacePage
