import { ReactNode, useEffect } from 'react'
import styled from 'styled-components/macro'

const StyledPopup = styled.div`
  position: fixed;
  top: env(safe-area-inset-top);
  right: env(safe-area-inset-right);
  bottom: env(safe-area-inset-bottom);
  left: env(safe-area-inset-left);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
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
  box-sizing: border-box;
  max-width: 880px;
  max-height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  border: 4px solid ${props => props.theme.colors.otterBlack};
  border-radius: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledInnerContainer = styled.div<{ background?: string }>`
  border-radius: 10px;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.otterBlack};

  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ background }) => background || 'transparent'};
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

interface Props {
  show?: boolean
  background?: string
  children: ReactNode
}

const Fullscreen = ({ show = true, background, children }: Props) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [show])

  if (!show) return null

  return (
    <StyledPopup>
      <Background />
      <Container>
        <StyledInnerContainer background={background}>
          <Content>{children}</Content>
        </StyledInnerContainer>
      </Container>
    </StyledPopup>
  )
}

export default Fullscreen
