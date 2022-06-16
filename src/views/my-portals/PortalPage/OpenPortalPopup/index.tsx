import { useQuery } from '@apollo/client'
import CloseIcon from 'assets/ui/close_icon.svg'
import Button from 'components/Button'
import Fullscreen from 'components/Fullscreen'
import PortalAnimation from 'components/PortalAnimation'
import { ottoClick } from 'constant'
import useApi, { OttoCandidateMeta } from 'hooks/useApi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, Display3, Headline } from 'styles/typography'
import { PortalStatus } from '__generated__/global-types'
import { GET_PORTAL } from '../queries'
import { GetPortal, GetPortalVariables } from '../__generated__/GetPortal'

const StyledOpenPortalPopup = styled.div`
  min-height: 90vh;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  color: white;
  background-color: ${({ theme }) => theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 20px 0;
    min-height: unset;
  }
`

const StyledCloseButton = styled.button`
  position: absolute;
  top: 35px;
  right: 35px;
`

const StyledCloseIcon = styled.img`
  width: 24px;
`

const StyledLoadingPortal = styled.div`
  width: 360px;
  height: 360px;
`

const StyledLoadingText = styled(ContentLarge)`
  white-space: pre-wrap;
`

const StyledSuccessPortal = styled.div`
  position: absolute;
  width: 360px;
  height: 360px;
  top: 130px;
  left: calc(50% - 180px);
  z-index: 0;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    top: 30px;
  }
`

const StyledPFPContainer = styled.div`
  width: 540px;
  height: 260px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 1;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    height: auto;
    margin-top: 60px;
  }
`

const StyledPFP = styled.img`
  width: 120px;
  height: 120px;
  background: url(/otto-loading.jpg);
  background-size: 100% 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 80px;
    height: 80px;
  }
`

const StyledHeadline = styled.p`
  margin-top: 80px;
  z-index: 2;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin-top: 200px;
  }
`

const StyledTitle = styled.p`
  z-index: 2;
`

const StyledDesc = styled.p`
  z-index: 2;
`

interface Props {
  show: boolean
  portalId: string
  onClose: () => void
}

export default function OpenPortalPopup({ show, portalId, onClose }: Props) {
  const { t } = useTranslation()
  const api = useApi()
  const [candidates, setCandidates] = useState<OttoCandidateMeta[]>([])
  const count = candidates.length
  const { data } = useQuery<GetPortal, GetPortalVariables>(GET_PORTAL, {
    variables: { portalId },
    skip: !show,
    pollInterval: 5000,
  })
  const loading = data?.ottos[0].portalStatus !== PortalStatus.OPENED
  const opened = data?.ottos[0].portalStatus === PortalStatus.OPENED
  const legendary = data?.ottos[0].legendary || false
  const audio = useMemo(() => {
    const audio = new Audio('/sfx-victory6.mp3')
    audio.load()
    return audio
  }, [])

  const fetchCandidates = useCallback(() => {
    api
      .getPortalCandidates(portalId)
      .then(data => {
        if (data.length === 0) {
          setTimeout(fetchCandidates, 1000)
        } else {
          setCandidates(data)
        }
      })
      .catch(err => console.error('get portal candidates failed', { err }))
  }, [api, portalId])

  useEffect(() => {
    if (opened) {
      fetchCandidates()
    }
  }, [portalId, api, opened])

  useEffect(() => {
    if (candidates.length > 0) audio.play()
  }, [candidates])

  return (
    <Fullscreen show={show}>
      <StyledOpenPortalPopup>
        {loading && (
          <>
            <StyledLoadingPortal>
              <PortalAnimation />
            </StyledLoadingPortal>
            <StyledLoadingText as="p">{t('portal.open_popup.processing')}</StyledLoadingText>
          </>
        )}
        {candidates.length > 0 && (
          <>
            <StyledCloseButton
              onClick={() => {
                ottoClick.play()
                onClose()
              }}
            >
              <StyledCloseIcon src={CloseIcon.src} />
            </StyledCloseButton>
            <StyledSuccessPortal>
              <PortalAnimation />
            </StyledSuccessPortal>
            <StyledPFPContainer>
              {candidates.map(({ image }, index) => (
                <StyledPFP key={index} src={image} />
              ))}
            </StyledPFPContainer>
            <StyledHeadline>
              <Headline>
                {legendary ? t('portal.open_popup.headline_legendary') : t(`portal.open_popup.headline_${count}`)}
              </Headline>
            </StyledHeadline>
            <StyledTitle>
              <Display3>
                {legendary ? t('portal.open_popup.title_legendary') : t('portal.open_popup.title', { count })}
              </Display3>
            </StyledTitle>
            <StyledDesc>
              <Caption>{t('portal.open_popup.desc', { count })}</Caption>
            </StyledDesc>
            <Button Typography={Headline} onClick={onClose}>
              {t('portal.open_popup.back_to_summon')}
            </Button>
          </>
        )}
      </StyledOpenPortalPopup>
    </Fullscreen>
  )
}
