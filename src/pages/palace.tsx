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

const PalacePage: NextPageWithLayout = () => {
  return <IFrameView src="https://v2-embednotion.com/64952dfd28ee4aee85a1c837af30f71d" scrolling="no" />
}

PalacePage.getLayout = (page, i18n) => {
  return <IFrameLayout title={i18n.t('treasury.palace.title')}>{page}</IFrameLayout>
}

export default PalacePage
