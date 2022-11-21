import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import styled from 'styled-components/macro'
import Hero from './Hero'
import Intro from './Intro'
import Mint from './Mint'

const MintPopup = dynamic(() => import('components/MintPopup'), {
  ssr: false,
})

const StyledPage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.otterBlack};
`

const MintPage = () => {
  const { t } = useTranslation('', { keyPrefix: 'mint' })

  return (
    <StyledPage>
      <Head>
        <title>{t('docTitle')}</title>
        <meta property="og:title" content={t('docTitle')} />
        <meta name="description" content={t('docDesc')} />
        <meta property="og:description" content={t('docDesc')} />
        <meta property="og:image" content="/og.jpg" />
      </Head>
      <Hero />
      <Mint />
      <Intro />
      <MintPopup />
    </StyledPage>
  )
}

export default MintPage
