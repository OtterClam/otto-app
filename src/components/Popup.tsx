import { ReactNode } from 'react'
import styled from 'styled-components/macro'
import { Headline } from 'styles/typography'
import exit from '../assets/ui/exit.svg'
import Button from './Button'

const StyledPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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
  width: 30rem;
  background-color: ${({ theme }) => theme.colors.crownYellow};
  padding: 6px;

  border: 4px solid ${props => props.theme.colors.otterBlack};
  border-radius: 20px;
`

const StyledInnerContainer = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  width: 100%;
  height: 100%;
  padding: 30px;
  background-color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const ExitButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
`

const Exit = styled.img`
  height: 16px;
`

const Header = styled.div`
  margin-bottom: 20px;
`

const SubHeader = styled(Headline)`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

interface Props {
  show: boolean
  close: () => void
  header?: string
  subHeader?: string
  buttonText?: string
  buttonAction?: () => void
  children?: ReactNode
}

const Popup = ({ show, close, header, subHeader, buttonText, buttonAction, children }: Props) => {
  if (!show) return null

  return (
    <StyledPopup>
      <Background />
      <Container>
        <StyledInnerContainer>
          <ExitButton onClick={() => close()}>
            <Exit src={exit} />
          </ExitButton>
          {header && (
            <Header>
              <Headline> {header}</Headline>
            </Header>
          )}
          {subHeader && <SubHeader>{subHeader}</SubHeader>}
          {children && <Content>{children}</Content>}
          {buttonText && buttonAction && (
            <Button onClick={buttonAction}>
              <Headline>{buttonText}</Headline>
            </Button>
          )}
        </StyledInnerContainer>
      </Container>
    </StyledPopup>
  )
}

export default Popup
