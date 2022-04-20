import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import Footer from './components/Footer'
import Header from './components/Header'

type Background = 'white' | 'dark'

const StyledBorder = styled.div`
  max-width: 1200px;
  flex: 1;
  width: 90%;
  height: 100%;
  overflow: hidden;
  padding: 6px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  box-sizing: border-box;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.crownYellow};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledNoBorder = styled.div`
  max-width: 1200px;
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledInnerBorder = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

const StyledContainer = styled.div<{ background: Background }>`
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  background-color: ${({ theme, background }) =>
    background === 'white' ? theme.colors.white : theme.colors.otterBlack};
`

interface Props {
  title: string
  noBorder?: boolean
  background?: Background
}

export default function Layout({ title, noBorder = false, background = 'white', children }: PropsWithChildren<Props>) {
  return (
    <>
      <Header title={title} />
      {noBorder ? (
        <StyledNoBorder>{children}</StyledNoBorder>
      ) : (
        <StyledBorder>
          <StyledInnerBorder>
            <StyledContainer background={background}>{children}</StyledContainer>
          </StyledInnerBorder>
        </StyledBorder>
      )}
      <Footer />
    </>
  )
}
