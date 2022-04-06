import { useQuery } from '@apollo/client'
import LoadingOtter from 'assets/loading-otter.png'
import CloseIcon from 'assets/ui/close_icon.svg'
import Button from 'components/Button'
import Fullscreen from 'components/Fullscreen'
import PortalAnimation from 'components/PortalAnimation'
import { ottoClick } from 'constant'
import useOtto from 'hooks/useOtto'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ContentLarge, Headline } from 'styles/typography'
import { GET_PORTAL } from '../queries'
import { GetPortal, GetPortalVariables } from '../__generated__/GetPortal'

const StyledSummonPopup = styled.div`
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

const StyledPortalAnimation = styled.div`
  position: absolute;
  width: 360px;
  height: 360px;
  top: 80px;
  left: calc(50% - 180px);
`

const StyledPFP = styled.img`
  position: absolute;
  top: 180px;
  width: 120px;
  height: 120px;
  z-index: 10;
`

const StyledDesc = styled.p`
  margin-top: 300px;
  white-space: pre-wrap;
  z-index: 9;
`

interface Props {
  show: boolean
  portalId: string
  onClose: () => void
}

export default function SummonPopup({ show, portalId, onClose }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data } = useQuery<GetPortal, GetPortalVariables>(GET_PORTAL, {
    variables: { portalId },
    skip: !show,
    pollInterval: 5000,
  })
  const loading = false // data?.ottos[0].portalStatus !== PortalStatus.SUMMONED
  const summoned = true // data?.ottos[0].portalStatus === PortalStatus.SUMMONED
  const { otto } = useOtto(summoned && data?.ottos[0])

  return (
    <Fullscreen show={show}>
      <StyledSummonPopup>
        {loading && (
          <>
            <StyledLoadingOtter src={LoadingOtter} />
            <StyledLoadingText as="p">{t('mint.popup.processing')}</StyledLoadingText>
          </>
        )}
        {otto && (
          <>
            <StyledCloseButton
              onClick={() => {
                ottoClick.play()
                onClose()
              }}
            >
              <StyledCloseIcon src={CloseIcon} />
            </StyledCloseButton>
            <StyledPortalAnimation>
              <PortalAnimation />
            </StyledPortalAnimation>
            <StyledPFP src={otto.image} />
            <StyledDesc>
              <ContentLarge>{t('portal.summon_popup.desc')}</ContentLarge>
            </StyledDesc>
            <Button
              onClick={() => {
                navigate(`/my-ottos/${portalId}`)
              }}
            >
              <Headline>{t('portal.summon_popup.view_my_otto')}</Headline>
            </Button>
          </>
        )}
      </StyledSummonPopup>
    </Fullscreen>
  )
}
