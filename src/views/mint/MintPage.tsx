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
  return (
    <StyledPage>
      <Hero />
      <Mint />
      <Intro />
    </StyledPage>
  )
}

export default MintPage
