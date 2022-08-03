import Board, { Background } from 'components/Board'
import MintView from 'views/mint/MintPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import DefaultLayout from 'layouts/DefaultLayout'
import RequireConnect from 'components/RequireConnect'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MintPage: NextPageWithLayout = MintView

MintPage.getLayout = (page, i18n) => {
  return (
    <DefaultLayout title={i18n.t('mint.title')}>
      <Board background={Background.Dark}>{page}</Board>
    </DefaultLayout>
  )
}

export default MintPage
