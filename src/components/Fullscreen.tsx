import { ReactNode } from 'react'
import styled from 'styled-components'

const StyledPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Background = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`

const Container = styled.div`
  position: relative;
  width: 80%;
  background-color: ${({ theme }) => theme.colors.crownYellow};
  padding: 6px;

  border: 4px solid ${props => props.theme.colors.otterBlack};
  border-radius: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledInnerContainer = styled.div`
  border-radius: 10px;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.otterBlack};

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

interface Props {
  show: boolean
  children?: ReactNode
}

const Fullscreen = ({ show, children }: Props) => {
  if (!show) return null

  return (
    <StyledPopup>
      <Background />
      <Container>
        <StyledInnerContainer>{children && <Content>{children}</Content>}</StyledInnerContainer>
      </Container>
    </StyledPopup>
  )
}

export default Fullscreen
