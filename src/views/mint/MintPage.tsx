import dynamic from 'next/dynamic'
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
  return (
    <StyledPage>
      <Hero />
      <Mint />
      <Intro />
      <MintPopup />
    </StyledPage>
  )
}

export default MintPage
