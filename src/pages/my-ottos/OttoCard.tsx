import BorderContainer from 'components/BorderContainer'
import ProgressBar from 'components/ProgressBar'
import { PortalState } from 'models/Portal'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'
import { Caption, ContentMedium, ContentSmall } from 'styles/typography'
import { RenderOttoProps } from './types'

const StyledOttoCard = styled(BorderContainer)`
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
    background-size: contain;
    background-repeat: no-repeat;
    width: 21px;
    height: 21px;
    margin-right: 10px;
    display: block;
  }
`

export default function OttoCard({ otto, metadata }: RenderOttoProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <StyledOttoCard borderColor={theme.colors.crownYellow}>
      <StyledPortalImage src={metadata?.image} />
      <StyledPortalTitle>
        <ContentMedium>{metadata?.name}</ContentMedium>
      </StyledPortalTitle>
    </StyledOttoCard>
  )
}
