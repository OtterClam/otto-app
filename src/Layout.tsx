import { useEthers } from '@usedapp/core'
import ConnectView from 'components/ConnectView'
import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import Footer from './components/Footer'
import PageHeader from './components/PageHeader'

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
  overflow-x: hidden;
  overflow-y: scroll;
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
  requireConnect?: boolean
}

export default function Layout({
  title,
  noBorder = false,
  background = 'white',
  requireConnect = false,
  children,
}: PropsWithChildren<Props>) {
  const { account } = useEthers()
  return (
    <>
      <PageHeader title={title} />
      {noBorder ? (
        <StyledNoBorder>{children}</StyledNoBorder>
      ) : (
        <StyledBorder>
          <StyledInnerBorder>
            <StyledContainer background={background}>
              {requireConnect && !account ? <ConnectView /> : children}
            </StyledContainer>
          </StyledInnerBorder>
        </StyledBorder>
      )}
      <Footer />
    </>
  )
}
