import MintView from 'views/mint/MintPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import Layout from 'Layout'
import { NextPageWithLayout } from './_app'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? '', ['common'])),
  },
})

const MintPage: NextPageWithLayout = MintView

MintPage.getLayout = page => {
  const { t } = useTranslation()
  return (
    <Layout title={t('mint.title')} background="dark">
      {page}
    </Layout>
  )
}

export default MintPage
