import dynamic from 'next/dynamic'
import { useQuery } from '@apollo/client'
import OpenSeaBlue from 'assets/opensea-blue.svg'
import Button from 'components/Button'
import { LoadingView } from 'components/LoadingView'
import ProgressBar from 'components/ProgressBar'
import { getOpenSeaLink } from 'constant'
import { useOpenPortal, useSummonOtto } from 'contracts/functions'
import { PortalState } from 'models/Portal'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, ContentSmall, Display3, Headline } from 'styles/typography'
import { PortalStatus } from '__generated__/otto/global-types'
import { GET_PORTAL } from 'graphs/otto'
import { GetPortal, GetPortalVariables } from 'graphs/__generated__/GetPortal'
import ClockImage from '../clock.png'
import PortalContainer from '../PortalContainer'
import GetThroughPortal from './get_through_portal.png'
import PortalCandidates from './PortalCandidates'

const SummonPopup = dynamic(() => import('./SummonPopup'), { ssr: false })
const OpenPortalPopup = dynamic(() => import('./OpenPortalPopup'), { ssr: false })

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
  background: url(/portal-loading.jpg);
  background-size: 100% 100%;

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
    background-image: url(${OpenSeaBlue.src});
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
    background: url(${ClockImage.src});
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
  const router = useRouter()
  const portalId = router.query.portalId as string
  const { data, loading, refetch } = useQuery<GetPortal, GetPortalVariables>(GET_PORTAL, {
    variables: { portalId },
  })
  const { openState, open, resetOpen } = useOpenPortal()
  const [showOpenPortalPopup, setShowOpenPortalPopup] = useState(false)
  const { summonState, summon, resetSummon } = useSummonOtto()
  const [showSummonPopup, setShowSummonPopup] = useState(false)

  useEffect(() => {
    if (openState.status === 'Mining') setShowOpenPortalPopup(true)
    if (openState.status === 'Fail' || openState.status === 'Exception') {
      setShowOpenPortalPopup(false)
      window.alert(openState.errorMessage)
      resetOpen()
    }
  }, [openState])

  useEffect(() => {
    if (summonState.status === 'Mining') setShowSummonPopup(true)
    if (summonState.status === 'Fail' || summonState.status === 'Exception') {
      setShowSummonPopup(false)
      window.alert(summonState.errorMessage)
      resetSummon()
    }
  }, [summonState])

  useEffect(() => {
    if (data?.ottos[0].portalStatus === PortalStatus.SUMMONED) {
      router.push(`/my-ottos/${portalId}`)
    }
  }, [data])

  return (
    <>
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
                      <ContentSmall>
                        {portal.legendary
                          ? t('my_portals.legendary_desc')
                          : state === PortalState.OPENED
                          ? t(`portal.open_popup.headline_${portal.candidates.length}`)
                          : metadata?.description}
                      </ContentSmall>
                    </StyledDescription>
                    {portal.beforeOpen && (
                      <>
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
                        <ProgressBar height="20px" progress={progress} />
                        <Button
                          disabled={state === PortalState.CHARGING}
                          onClick={() => open(portalId)}
                          Typography={Headline}
                        >
                          {t('my_portals.open_now')}
                        </Button>
                      </>
                    )}
                    {state === PortalState.OPENED && (
                      <StyledOpenDesc>
                        <StyledOpenImg src={GetThroughPortal.src} />
                        <StyledOpenDescText>
                          <ContentSmall>{t('portal.open_desc_1')}</ContentSmall>
                          <StyledOpenDescNumber>{t('otto', { count: portal.candidates.length })}</StyledOpenDescNumber>
                          <ContentSmall>{t('portal.open_desc_2')}</ContentSmall>
                        </StyledOpenDescText>
                      </StyledOpenDesc>
                    )}
                  </StyledContentContainer>
                </StyledPortalInfo>
                {state === PortalState.OPENED && (
                  <PortalCandidates portal={portal} onSummon={index => summon(portalId, index)} />
                )}
              </>
            )}
          </PortalContainer>
        )}
      </StyledPortalPage>
      {showOpenPortalPopup && (
        <OpenPortalPopup
          show={showOpenPortalPopup}
          portalId={portalId}
          onClose={() => {
            setShowOpenPortalPopup(false)
            refetch()
          }}
        />
      )}
      {showSummonPopup && (
        <SummonPopup
          show={showSummonPopup}
          portalId={portalId}
          onClose={() => {
            setShowSummonPopup(false)
            refetch()
          }}
        />
      )}
    </>
  )
}
