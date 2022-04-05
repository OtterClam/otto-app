import { useQuery } from '@apollo/client'
import LoadingOtter from 'assets/loading-otter.png'
import SuccessPortal from 'assets/success-portal.png'
import Button from 'components/Button'
import Fullscreen from 'components/Fullscreen'
import { ottoClick } from 'constant'
import useApi, { OttoCandidateMeta } from 'hooks/useApi'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Caption, ContentLarge, Display3, Headline } from 'styles/typography'
import { PortalStatus } from '__generated__/global-types'
import CloseIcon from 'assets/ui/close_icon.svg'
import LegendaryPortal from 'assets/legendary_portal.png'
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
`

const StyledCloseButton = styled.button`
  position: absolute;
  top: 35px;
  right: 35px;
`

const StyledCloseIcon = styled.img`
  width: 24px;
`

const StyledLoadingOtter = styled.img`
  width: 142px;
  height: 127px;
`

const StyledLoadingText = styled(ContentLarge)``

const StyledLegendaryPortal = styled.img`
  position: absolute;
  width: 400px;
  height: 400px;
  top: 50px;
  left: calc(50% - 200px);
  z-index: 0;
`

const StyledSuccessPortal = styled.img`
  position: absolute;
  width: 300px;
  height: 300px;
  top: 130px;
  left: calc(50% - 150px);
  z-index: 0;
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
`

const StyledPFP = styled.img`
  width: 120px;
  height: 120px;
`

const StyledHeadline = styled.p`
  margin-top: 80px;
`

const StyledTitle = styled.p``

const StyledDesc = styled.p``

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

  useEffect(() => {
    if (opened) api.getPortalCandidates(portalId).then(setCandidates)
  }, [portalId, api, opened])

  return (
    <Fullscreen show={show}>
      <StyledOpenPortalPopup>
        {loading && (
          <>
            <StyledLoadingOtter src={LoadingOtter} />
            <StyledLoadingText as="p">{t('mint.popup.processing')}</StyledLoadingText>
          </>
        )}
        {opened && (
          <>
            <StyledCloseButton
              onClick={() => {
                ottoClick.play()
                onClose()
              }}
            >
              <StyledCloseIcon src={CloseIcon} />
            </StyledCloseButton>
            {legendary ? <StyledLegendaryPortal src={LegendaryPortal} /> : <StyledSuccessPortal src={SuccessPortal} />}
            <StyledPFPContainer>
              {candidates.map(({ image }, index) => (
                <StyledPFP key={index} src={image} />
              ))}
            </StyledPFPContainer>
            <StyledHeadline>
              <Headline>{t(`portal.open_popup.headline_${count}`)}</Headline>
            </StyledHeadline>
            <StyledTitle>
              <Display3>
                {legendary ? t('portal.open_popup.title_legendary') : t('portal.open_popup.title', { count })}
              </Display3>
            </StyledTitle>
            <StyledDesc>
              <Caption>{t('portal.open_popup.desc', { count })}</Caption>
            </StyledDesc>
            <Button onClick={onClose}>
              <Headline>{t('portal.open_popup.back_to_summon')}</Headline>
            </Button>
          </>
        )}
      </StyledOpenPortalPopup>
    </Fullscreen>
  )
}
