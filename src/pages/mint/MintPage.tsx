import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Hero from './Hero'
import Countdown from './Countdown'

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
      <Countdown />
      <Hero />
    </StyledPage>
  )
}

export default MintPage
