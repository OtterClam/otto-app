import { PropsWithChildren } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Footer from './components/Footer'
import Header from './components/Header'

const StyledBorder = styled.div`
  max-width: 1200px;
  flex: 1;
  width: 90%;
  height: 100%;
  overflow: hidden;
  padding: 6px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  box-sizing: border-box;
  backdrop-filter: blur(5px);
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

const StyledContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.otterBlack};
`

export default function Layout({
  title,
  noBorder = false,
  children,
}: PropsWithChildren<{ title: string; noBorder?: boolean }>) {
  return (
    <>
      <Header title={title} />
      {noBorder ? (
        <StyledNoBorder>{children}</StyledNoBorder>
      ) : (
        <StyledBorder>
          <StyledInnerBorder>
            <StyledContainer>{children}</StyledContainer>
          </StyledInnerBorder>
        </StyledBorder>
      )}
      <Footer />
    </>
  )
}
