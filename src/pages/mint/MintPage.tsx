import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Hero from './Hero'
import Countdown from './Countdown'
import Intro from './Intro'
import CheckWL from './CheckWL'
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
    <StyledPage>
      <Mint />
      <Countdown />
      <Hero />
      <CheckWL />
      <Intro />
    </StyledPage>
  )
}

export default MintPage
