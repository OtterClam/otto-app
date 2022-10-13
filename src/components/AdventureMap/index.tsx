import CroppedImage from 'components/CroppedImage'
import styled from 'styled-components/macro'
import { ContentExtraSmall } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import TreasureChestLevel from 'components/TreasureChestLevel'
import { useAdventureLocations } from 'contexts/AdventureLocations'
import AdventureLocation from 'components/AdventureLocation'
import { forwardRef } from 'react'
import continueImage from './continue.png'
import mapImage from './map.jpg'

const StyledContainer = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colors.sandBrown};
  min-height: var(--game-body-height);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding-bottom: 48px;
  }
`

const StyledFooter = styled.div`
  display: flex;
  gap: 9px;
  align-items: end;
  position: absolute;
  bottom: 39px;
  left: 24px;
  right: 24px;
  z-index: 0;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column-reverse;
    bottom: 87px;
  }
`

const StyledContinue = styled(ContentExtraSmall)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 176px;
  background: center / cover url(${continueImage.src});
  min-width: 176px;
  max-width: 176px;
  min-height: 52px;
  max-height: 52px;
`

const StyledTreasureChestLevel = styled(TreasureChestLevel)`
  flex: 1 calc(100% - 176px);
`

const StyledImageContainer = styled.div`
  position: relative;
`

export interface AdventureMapProps {
  hideFooter?: boolean
  className?: string
}

export default forwardRef<HTMLDivElement, AdventureMapProps>(function AdventureMap({ hideFooter, className }, ref) {
  const { t } = useTranslation('', { keyPrefix: 'adventure' })
  const { locations } = useAdventureLocations()

  return (
    <StyledContainer className={className} ref={ref}>
      <StyledImageContainer>
        <CroppedImage src={mapImage} layout="responsive" />
        {locations.map(location => (
          <AdventureLocation key={location.id} id={location.id} />
        ))}
      </StyledImageContainer>
      {!hideFooter && (
        <StyledFooter>
          <StyledTreasureChestLevel />
          <StyledContinue>{t('continue')}</StyledContinue>
        </StyledFooter>
      )}
    </StyledContainer>
  )
})
