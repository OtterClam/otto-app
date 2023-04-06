import styled from 'styled-components/macro'
import { ContentExtraSmall } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import TreasureChestLevel from 'components/TreasureChestLevel'
import { useAdventureLocations } from 'contexts/AdventureLocations'
import AdventureLocation from 'components/AdventureLocation'
import Image from 'next/image'
import continueImage from './continue.png'
import mapImage from './map.jpg'

const StyledContainer = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colors.sandBrown};
  min-height: var(--game-body-height);

  @media ${({ theme }) => theme.breakpoints.tablet} {
    padding-bottom: 148px;
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

  @media ${({ theme }) => theme.breakpoints.tablet} {
    bottom: 100px;
  }

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
  width: 100%;

  &::before {
    content: '';
    display: block;
    padding-bottom: 153.333689%;
  }
`

export interface AdventureMapProps {
  ottoLocked?: boolean
  hideFooter?: boolean
  className?: string
}

export default function AdventureMap({ hideFooter, className, ottoLocked }: AdventureMapProps) {
  const { t } = useTranslation('', { keyPrefix: 'adventure' })
  const { locations } = useAdventureLocations()

  return (
    <StyledContainer className={className}>
      <StyledImageContainer>
        <Image unoptimized src={mapImage} layout="fill" priority />
        {locations.map(location => (
          <AdventureLocation key={location.id} ottoLocked={ottoLocked} id={location.id} />
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
}
