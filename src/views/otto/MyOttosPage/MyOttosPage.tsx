/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEthers } from '@usedapp/core'
import ConnectView from 'components/ConnectView'
import { LoadingView } from 'components/LoadingView'
import MintBanner from 'components/MintBanner'
import { ottoClick } from 'constant'
import { MyOttosContext } from 'MyOttosProvider'
import { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components/macro'
import Link from 'next/link'
import OttoCard from 'components/OttoCard'
import NoOttoView from './NoOttoView'

const StyledMyOttosPage = styled.div`
  width: 100%;
  /* height: 100%; */
  min-height: 100%;
  background-color: white;
`

const StyledMyOttos = styled.div`
  padding: 20px;
  background-color: white;
  display: grid;
  justify-content: left;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, max(265px));

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 10px;
    gap: 5px;
    grid-template-columns: 1fr 1fr;
  }
`

const StyledMintBanner = styled.div`
  padding: 30px;
`

enum State {
  Loading,
  NoOttos,
  HasOttos,
}

export default function MyOttosPage() {
  const { account } = useEthers()
  const { ottos, loading } = useContext(MyOttosContext)
  const state = useMemo(() => {
    if (loading) {
      return State.Loading
    }
    if ((ottos.length || 0) > 0) {
      return State.HasOttos
    }
    return State.NoOttos
  }, [account, loading, ottos])
  const renderContent = useCallback(() => {
    switch (state) {
      case State.Loading:
        return <LoadingView />
      case State.NoOttos:
        return <NoOttoView />
      case State.HasOttos:
        return (
          <>
            <StyledMyOttos>
              {ottos.map((otto, index) => (
                <Link key={index} href={`/my-ottos/${otto.tokenId}`}>
                  <a onClick={() => ottoClick.play()}>
                    <OttoCard otto={otto} />
                  </a>
                </Link>
              ))}
              {ottos.map((otto, index) => (
                <Link key={index} href={`/my-ottos/${otto.tokenId}`}>
                  <a onClick={() => ottoClick.play()}>
                    <OttoCard otto={otto} />
                  </a>
                </Link>
              ))}
            </StyledMyOttos>
            <StyledMintBanner>
              <MintBanner />
            </StyledMintBanner>
          </>
        )
      default:
        return <ConnectView />
    }
  }, [state, ottos])
  return <StyledMyOttosPage>{renderContent()}</StyledMyOttosPage>
}
