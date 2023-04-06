/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEthers } from '@usedapp/core'
import ConnectView from 'components/ConnectView'
import { useTranslation } from 'next-i18next'
import { LoadingView } from 'components/LoadingView'
import MintBanner from 'components/MintBanner'
import { ottoClick } from 'constant'
import { MyOttosContext } from 'MyOttosProvider'
import { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components/macro'
import Head from 'next/head'
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
  const { t } = useTranslation('', { keyPrefix: 'my_ottos' })
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
  }, [loading, ottos])

  const renderMetaTags = useCallback(() => {
    let description = ''

    switch (state) {
      case State.NoOttos:
        description = t('no_otto')
        break
      case State.HasOttos:
        description = t('has_otto')
        break
      default:
        return null
    }

    return (
      <>
        <title>{t('docTitle')}</title>
        <meta property="og:title" content={t('docTitle')} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/og.jpg" />
      </>
    )
  }, [state, t])

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
                <Link key={index} href={`/my-ottos/${otto.id}`}>
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
  return (
    <StyledMyOttosPage>
      <Head>{renderMetaTags()}</Head>
      {renderContent()}
    </StyledMyOttosPage>
  )
}
