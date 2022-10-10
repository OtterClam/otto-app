import AdventureInfoSection from 'components/AdventureInfoSection'
import { useAdventureLocation } from 'contexts/AdventureLocation'
import { parseBoosts } from 'models/AdventureDisplayedBoost'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
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
  noPreview?: boolean
}

export default function AdventureConditionalBoosts({ noPreview }: AdventureConditionalBoostsProps) {
  const { t, i18n } = useTranslation('', { keyPrefix: 'conditionalBoosts' })
  const location = useAdventureLocation()

  const boosts = useMemo(() => {
    if (!location) {
      return []
    }
    return parseBoosts(i18n, location.conditionalBoosts)
  }, [location, i18n])

  const effectiveBoosts = boosts.filter(boost => boost.effective)
  const ineffectiveBoosts = boosts.filter(boost => !boost.effective)

  return (
    <AdventureInfoSection title={t('title')} help={t('help')}>
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
