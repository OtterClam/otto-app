import BorderContainer from 'components/BorderContainer'
import ProgressBar from 'components/ProgressBar'
import { PortalState } from 'models/Portal'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { Caption, ContentMedium, ContentSmall } from 'styles/typography'
import ClockImage from './clock.png'
import { RenderPortalProps } from './types'

const StyledPortalCard = styled(BorderContainer)`
  width: 265px;
  height: 448px;
  display: flex;
  flex-direction: column;

  padding: 15px;
  gap: 12px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    height: 363px;
    padding: 8px 5px;
    gap: 8px;
    align-items: center;
  }

  &:hover {
    transform: scale(1.01);
    background-color: ${({ theme }) => theme.colors.lightGray100};
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`

const StyledPortalImage = styled.img`
  width: 225px;
  height: 225px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  background: url(/portal-loading.jpg);
  background-size: 100% 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 90%;
    height: unset;
  }
`

const StyledPortalTitle = styled.div`
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledPortalStatus = styled.div`
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledCountdown = styled.div`
  width: 90%;
  display: flex;
  color: ${({ theme }) => theme.colors.darkGray200};
  align-items: center;

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

const StyledCanOpenText = styled.p`
  color: ${({ theme }) => theme.colors.seaweedGreen};
`

const StyledProgressBar = styled(ProgressBar)`
  width: 90%;
`

const StyledOpenedText = styled.p`
  color: ${({ theme }) => theme.colors.otterBlue};
`

export default function PortalCard({ portal, state, progress, duration, metadata }: RenderPortalProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const borderColor = useMemo(() => {
    if (state === PortalState.OPENED) return theme.colors.crownYellow
    if (state === PortalState.CAN_OPEN) return theme.colors.seaweedGreen
    return theme.colors.clamPink
  }, [state])
  return (
    <StyledPortalCard borderColor={borderColor}>
      <StyledPortalImage src={metadata?.image} />
      <StyledPortalTitle>
        <ContentMedium>{metadata?.name}</ContentMedium>
      </StyledPortalTitle>
      <StyledPortalStatus>
        <ContentSmall>{t(portal.legendary ? 'my_portals.legendary_desc' : `my_portals.state.${state}`)}</ContentSmall>
      </StyledPortalStatus>
      {state !== PortalState.OPENED && <StyledProgressBar height="12px" progress={progress} />}
      {state === PortalState.CHARGING && (
        <StyledCountdown>
          <Caption>{t('my_portals.open_duration', { duration })}</Caption>
        </StyledCountdown>
      )}
      {state === PortalState.CAN_OPEN && (
        <StyledCanOpenText>
          <Caption>{t('my_portals.open_portal')}</Caption>
        </StyledCanOpenText>
      )}
      {state === PortalState.OPENED && (
        <StyledOpenedText>
          <Caption>{t('my_portals.choose_otto')}</Caption>
        </StyledOpenedText>
      )}
    </StyledPortalCard>
  )
}
