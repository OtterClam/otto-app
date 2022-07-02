import { useQuery } from '@apollo/client'
import CloseIcon from 'assets/ui/close_icon.svg'
import Button from 'components/Button'
import Fullscreen from 'components/Fullscreen'
import PortalAnimation from 'components/PortalAnimation'
import { ottoClick } from 'constant'
import useOtto from 'hooks/useOtto'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentLarge, Headline } from 'styles/typography'
import { PortalStatus } from '__generated__/otto/global-types'
import { GetPortal, GetPortalVariables } from 'graphs/__generated__/GetPortal'
import { GET_PORTAL } from 'graphs/otto'

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
  background: ${({ theme }) => theme.colors.otterBlack};
`

const StyledCloseButton = styled.button`
  position: absolute;
  top: 35px;
  right: 35px;
`

const StyledCloseIcon = styled.img`
  width: 24px;
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
  width: 156px;
  height: 156px;
  z-index: 10;
  background: url(/otto-loading.jpg);
  background-size: 100% 100%;
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
  const router = useRouter()
  const { data } = useQuery<GetPortal, GetPortalVariables>(GET_PORTAL, {
    variables: { portalId },
    skip: !show,
    pollInterval: 5000,
  })
  const loading = data?.ottos[0].portalStatus !== PortalStatus.SUMMONED
  const summoned = data?.ottos[0].portalStatus === PortalStatus.SUMMONED
  const { otto } = useOtto(summoned && data?.ottos[0], false)

  return (
    <Fullscreen show={show}>
      <StyledSummonPopup>
        {loading && (
          <>
            <PortalAnimation />
            <StyledLoadingText as="p">{t('mint.popup.processing')}</StyledLoadingText>
          </>
        )}
        {otto && (
          <>
            <StyledCloseButton
              onClick={() => {
                ottoClick.play()
                router.push(`/my-ottos/${portalId}`)
              }}
            >
              <StyledCloseIcon src={CloseIcon.src} />
            </StyledCloseButton>
            <StyledPortalAnimation>
              <PortalAnimation />
            </StyledPortalAnimation>
            <StyledPFP src={otto.image} />
            <StyledDesc>
              <ContentLarge>{t('portal.summon_popup.desc')}</ContentLarge>
            </StyledDesc>
            <Button
              Typography={Headline}
              onClick={() => {
                router.push(`/my-ottos/${portalId}`)
              }}
            >
              {t('portal.summon_popup.view_my_otto')}
            </Button>
          </>
        )}
      </StyledSummonPopup>
    </Fullscreen>
  )
}
