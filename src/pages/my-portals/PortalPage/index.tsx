import { gql, useQuery } from '@apollo/client'
import OpenSeaBlue from 'assets/opensea-blue.svg'
import Button from 'components/Button'
import { LoadingView } from 'components/LoadingView'
import ProgressBar from 'components/ProgressBar'
import { getOpenSeaLink, OPENSEA_NFT_LINK } from 'constant'
import Layout from 'Layout'
import { PortalState } from 'models/Portal'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Display3, Headline } from 'styles/typography'
import { useOpenPortal } from 'contracts/functions'
import { useEffect, useState } from 'react'
import ClockImage from '../clock.png'
import PortalContainer from '../PortalContainer'
import { GetPortal, GetPortalVariables } from './__generated__/GetPortal'
import GetThroughPortal from './get_through_portal.png'
import PortalCandidates from './PortalCandidates'
import OpenPortalPopup from './OpenPortalPopup'
import { GET_PORTAL } from './queries'

const StyledPortalPage = styled.div`
  min-height: 100%;
  background: white;
  padding: 30px;
`

const StyledPortalInfo = styled.div`
  display: flex;
  gap: 30px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    align-items: center;
  }
`

const StyledPortalImage = styled.img`
  width: 440px;
  min-width: 440px;
  height: 440px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    height: unset;
  }
`

const StyledContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
`

const StyledOpenSeaLink = styled.a`
  display: flex;
  color: ${({ theme }) => theme.colors.otterBlack};

  &:before {
    content: '';
    background-image: url(${OpenSeaBlue});
    background-size: contain;
    background-repeat: no-repeat;
    width: 21px;
    height: 21px;
    margin-right: 10px;
    display: block;
  }
`

const StyledTitle = styled.p`
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledDescription = styled.p`
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledStatusContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledStatus = styled.p`
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledDuration = styled.p`
  display: flex;
  color: ${({ theme }) => theme.colors.darkGray200};
  &::before {
    content: '';
    background: url(${ClockImage});
    background-size: contain;
    background-repeat: no-repeat;
    width: 21px;
    height: 21px;
    margin-right: 10px;
    display: block;
  }
`

const StyledOpenDesc = styled.div`
  padding: 30px;
  background: ${({ theme }) => theme.colors.lightGray100};
  border: 4px solid ${({ theme }) => theme.colors.lightGray400};
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`

const StyledOpenImg = styled.img`
  width: 98px;
`

const StyledOpenDescText = styled.p``

const StyledOpenDescNumber = styled(ContentSmall)`
  color: ${({ theme }) => theme.colors.clamPink};
`

export default function PortalPage() {
  const { t } = useTranslation()
  const { portalId = '0' } = useParams()
  const { data, loading, refetch } = useQuery<GetPortal, GetPortalVariables>(GET_PORTAL, {
    variables: { portalId },
  })
  const { openState, open, resetOpen } = useOpenPortal()
  const [showOpenPortalPopup, setShowOpenPortalPopup] = useState(false)
  useEffect(() => {
    if (openState.status === 'Mining') setShowOpenPortalPopup(true)
    if (openState.status === 'Fail' || openState.status === 'Exception') {
      setShowOpenPortalPopup(false)
      window.alert(openState.errorMessage)
      resetOpen()
    }
  }, [openState])
  return (
    <Layout title={t('my_portals.title')}>
      <StyledPortalPage>
        {loading && <LoadingView />}
        {data && (
          <PortalContainer rawPortal={data.ottos[0]}>
            {({ portal, state, duration, progress, metadata }) => (
              <>
                <StyledPortalInfo>
                  <StyledPortalImage src={metadata?.image} />
                  <StyledContentContainer>
                    <StyledOpenSeaLink href={getOpenSeaLink(portal.tokenId)} target="_blank">
                      <Caption>{t('my_portals.opensea_link')}</Caption>
                    </StyledOpenSeaLink>
                    <StyledTitle>
                      <Display3>{metadata?.name}</Display3>
                    </StyledTitle>
                    <StyledDescription>
                      <ContentSmall>{metadata?.description}</ContentSmall>
                    </StyledDescription>
                    {state !== PortalState.OPENED && (
                      <StyledStatusContainer>
                        <StyledStatus>
                          <ContentLarge>{t(`portal.state.${state}`)}</ContentLarge>
                        </StyledStatus>
                        {state === PortalState.CHARGING && (
                          <StyledDuration>
                            <Caption>{duration}</Caption>
                          </StyledDuration>
                        )}
                      </StyledStatusContainer>
                    )}
                    {state !== PortalState.OPENED && (
                      <>
                        <ProgressBar height="20px" progress={progress} />
                        <Button disabled={state === PortalState.CHARGING} onClick={() => open(portalId)}>
                          <Headline>{t('my_portals.open_now')}</Headline>
                        </Button>
                      </>
                    )}
                    {state === PortalState.OPENED && (
                      <StyledOpenDesc>
                        <StyledOpenImg src={GetThroughPortal} />
                        <StyledOpenDescText>
                          <ContentSmall>{t('portal.open_desc_1')}</ContentSmall>
                          <StyledOpenDescNumber>{t('otto', { count: portal.candidates.length })}</StyledOpenDescNumber>
                          <ContentSmall>{t('portal.open_desc_2')}</ContentSmall>
                        </StyledOpenDescText>
                      </StyledOpenDesc>
                    )}
                  </StyledContentContainer>
                </StyledPortalInfo>
                {state === PortalState.OPENED && <PortalCandidates portal={portal} />}
              </>
            )}
          </PortalContainer>
        )}
      </StyledPortalPage>
      <OpenPortalPopup
        show={showOpenPortalPopup}
        portalId={portalId}
        onClose={() => {
          setShowOpenPortalPopup(false)
          refetch()
        }}
      />
    </Layout>
  )
}
