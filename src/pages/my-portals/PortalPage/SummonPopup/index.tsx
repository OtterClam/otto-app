import { useQuery } from '@apollo/client'
import LoadingOtter from 'assets/loading-otter.png'
import SuccessPortal from 'assets/success-portal.png'
import CloseIcon from 'assets/ui/close_icon.svg'
import Button from 'components/Button'
import Fullscreen from 'components/Fullscreen'
import { ottoClick } from 'constant'
import useApi from 'hooks/useApi'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ContentLarge, Display3, Headline } from 'styles/typography'
import { PortalStatus } from '__generated__/global-types'
import LegendaryPortal from 'assets/legendary_portal.png'
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

export default function SummonPopup({ show, portalId, onClose }: Props) {
  const { t } = useTranslation()
  const api = useApi()
  const { data } = useQuery<GetPortal, GetPortalVariables>(GET_PORTAL, {
    variables: { portalId },
    skip: !show,
    pollInterval: 5000,
  })
  const [metadata, setMetadata] = useState<PortalMeta | null>(null)
  const loading = data?.ottos[0].portalStatus !== PortalStatus.SUMMONED
  const summoned = data?.ottos[0].portalStatus === PortalStatus.SUMMONED
  const legendary = data?.ottos[0].legendary || false

  useEffect(() => {
    if (summoned) api.axios.get(data?.ottos[0].tokenURI).then(res => setMetadata(res.data))
  }, [portalId, api, summoned])

  return (
    <Fullscreen show={show}>
      <StyledSummonPopup>
        {loading && (
          <>
            <StyledLoadingOtter src={LoadingOtter} />
            <StyledLoadingText as="p">{t('mint.popup.processing')}</StyledLoadingText>
          </>
        )}
        {summoned && (
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
            <StyledPFP src={metadata?.image} />
            <StyledTitle>
              <Display3>Summoned!! {metadata?.name}</Display3>
            </StyledTitle>
            <Button onClick={onClose}>
              <Headline>{t('portal.open_popup.back_to_summon')}</Headline>
            </Button>
          </>
        )}
      </StyledSummonPopup>
    </Fullscreen>
  )
}
