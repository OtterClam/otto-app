import { useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { LoadingView } from 'components/LoadingView'
import { ottoClick } from 'constant'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import Head from 'next/head'
import ConnectView from 'components/ConnectView'
import { useRouter } from 'next/router'
import { LIST_MY_PORTALS } from 'graphs/otto'
import { ListMyPortals, ListMyPortalsVariables } from 'graphs/__generated__/ListMyPortals'
import DefaultMetaTags from 'components/DefaultMetaTags'
import NoPortalView from './NoPortalView'
import PortalCard from './PortalCard'
import PortalContainer from './PortalContainer'

const StyledMyPortalsPage = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-color: white;
`

const StyledMyPortals = styled.div`
  padding: 20px;
  background-color: white;
  display: grid;
  justify-content: left;
  align-items: center;
  justify-items: center;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, 265px);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 10px;
    gap: 5px;
    grid-template-columns: 1fr 1fr;
  }
`

enum State {
  Loading,
  NoPortals,
  HasPortals,
}

export default function MyPortalsPage() {
  const { t } = useTranslation('', { keyPrefix: 'my_portals' })
  const router = useRouter()
  const { account } = useEthers()
  const { data, loading } = useQuery<ListMyPortals, ListMyPortalsVariables>(LIST_MY_PORTALS, {
    variables: { owner: account || '' },
    skip: !account,
  })
  const state = useMemo(() => {
    if (loading) {
      return State.Loading
    }
    if ((data?.ottos.length || 0) > 0) {
      return State.HasPortals
    }
    return State.NoPortals
  }, [loading, data])

  const renderMetaTags = useCallback(() => {
    let description = ''

    switch (state) {
      case State.NoPortals:
        description = t('no_portal')
        break
      case State.HasPortals:
        description = t('has_portals')
        break
      default:
        return null
    }

    return (
      <Head>
        <title>{t('docTitle')}</title>
        <meta property="og:title" content={t('docTitle')} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/og.jpg" />
      </Head>
    )
  }, [state, t])

  const renderContent = useCallback(() => {
    switch (state) {
      case State.Loading:
        return <LoadingView />
      case State.NoPortals:
        return <NoPortalView />
      case State.HasPortals:
        return (
          <StyledMyPortals>
            {data?.ottos.map((portal, index) => (
              <a
                key={index}
                href={portal.tokenId}
                onClick={e => {
                  e.preventDefault()
                  ottoClick.play()
                  router.push(`/my-portals/${portal.tokenId}`)
                }}
              >
                <PortalContainer rawPortal={portal}>{props => <PortalCard {...props} />}</PortalContainer>
              </a>
            ))}
          </StyledMyPortals>
        )
      default:
        return <ConnectView />
    }
  }, [state, data, router])
  return (
    <StyledMyPortalsPage>
      <DefaultMetaTags />
      {renderMetaTags()}
      {renderContent()}
    </StyledMyPortalsPage>
  )
}
