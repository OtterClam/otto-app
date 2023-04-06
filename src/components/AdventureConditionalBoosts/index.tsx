import AdventureInfoSection from 'components/AdventureInfoSection'
import { useAdventureLocation } from 'contexts/AdventureLocation'
import { parseBoosts } from 'models/AdventureDisplayedBoost'
import { BoostType } from 'models/AdventureLocation'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components/macro'
import Boost from './Boost'

const StyledBoosts = styled.div`
  position: relative;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  &:nth-child(2)::before {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 0;
    display: block;
    content: '';
    border-top: 1px ${({ theme }) => theme.colors.darkGray300} solid;
  }
`

export interface AdventureConditionalBoostsProps {
  otto?: Otto
  noPreview?: boolean
  locationBoostsOnly?: boolean
  loading?: boolean
}

export default function AdventureConditionalBoosts({
  otto,
  noPreview,
  locationBoostsOnly,
  loading,
}: AdventureConditionalBoostsProps) {
  const { t, i18n } = useTranslation('', { keyPrefix: 'conditionalBoosts' })
  const location = useAdventureLocation()

  const boosts = useMemo(() => {
    if (!location) {
      return []
    }
    if (locationBoostsOnly) {
      const boosts = parseBoosts(i18n, otto, location.conditionalBoosts, true)
      return boosts.filter(boost => boost.boostType === BoostType.FirstMatchGroup)
    }
    return parseBoosts(i18n, otto, location.conditionalBoosts)
  }, [location, locationBoostsOnly, otto, i18n])

  const effectiveBoosts = boosts.filter(boost => boost.effective)
  const ineffectiveBoosts = boosts.filter(boost => !boost.effective)

  if (loading) {
    return (
      <AdventureInfoSection
        title={t(locationBoostsOnly ? 'regional_boosts' : 'title')}
        help={t(locationBoostsOnly ? 'regional_boosts_help' : 'help')}
      >
        <StyledBoosts>
          <Skeleton width="100%" count={4.8} />
        </StyledBoosts>
      </AdventureInfoSection>
    )
  }

  return (
    <AdventureInfoSection
      title={t(locationBoostsOnly ? 'regional_boosts' : 'title')}
      help={t(locationBoostsOnly ? 'regional_boosts_help' : 'help')}
    >
      {effectiveBoosts.length > 0 && (
        <StyledBoosts>
          {effectiveBoosts.map((boost, i) => (
            <Boost key={i} boost={boost} />
          ))}
        </StyledBoosts>
      )}
      {ineffectiveBoosts.length > 0 && (
        <StyledBoosts>
          {ineffectiveBoosts.map((boost, i) => (
            <Boost key={i} boost={boost} noPreview={noPreview} />
          ))}
        </StyledBoosts>
      )}
    </AdventureInfoSection>
  )
}
