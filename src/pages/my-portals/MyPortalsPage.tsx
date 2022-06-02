import { gql, useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import { LoadingView } from 'components/LoadingView'
import { ottoClick } from 'constant'
import Layout from 'Layout'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'
import ConnectView from 'components/ConnectView'
import NoPortalView from './NoPortalView'
import PortalCard from './PortalCard'
import PortalContainer from './PortalContainer'
import { ListMyPortals, ListMyPortalsVariables } from './__generated__/ListMyPortals'

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

export const LIST_MY_PORTALS = gql`
  query ListMyPortals($owner: Bytes!) {
    ottos(where: { owner: $owner, portalStatus_not: SUMMONED, epoch: -1 }, orderBy: tokenId) {
      tokenId
      tokenURI
      portalStatus
      canOpenAt
      mintAt
      candidates
      legendary
    }
  }
`

enum State {
  Loading,
  NoPortals,
  HasPortals,
}

export default function MyPortalsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
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
  }, [account, loading, data])
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
                  navigate(portal.tokenId)
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
  }, [state, data])
  return (
    <Layout title={t('my_portals.title')} requireConnect>
      <StyledMyPortalsPage>{renderContent()}</StyledMyPortalsPage>
    </Layout>
  )
}
