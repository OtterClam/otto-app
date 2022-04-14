import Layout from 'Layout'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import Hero from './Hero'
import Intro from './Intro'
import Mint from './Mint'

const StyledPage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.otterBlack};
`

const MintPage = () => {
  const { t } = useTranslation()
  return (
    <Layout title={t('mint.title')}>
      <StyledPage>
        <Hero />
        <Mint />
        <Intro />
      </StyledPage>
    </Layout>
  )
}

export default MintPage
