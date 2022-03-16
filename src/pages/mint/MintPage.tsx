import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Hero from './hero'
import Countdown from './countdown'

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
      <div style={{ background: '#666', width: '580px', height: '1800px' }} />
    </StyledPage>
  )
}

export default MintPage
