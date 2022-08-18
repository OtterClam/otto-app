import Board, { Background } from 'components/Board'
import FoundryView from 'views/foundry'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import DefaultLayout from 'layouts/DefaultLayout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const FoundryPage: NextPageWithLayout = FoundryView

FoundryPage.getLayout = (page, i18n) => {
  return (
    <DefaultLayout title={i18n.t('foundry.title')}>
      <Board background={Background.Dark}>{page}</Board>
    </DefaultLayout>
  )
}

export default FoundryPage
