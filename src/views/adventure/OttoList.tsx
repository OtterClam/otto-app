import AdventureOttoCard from 'components/AdventureOttoCard'
import { useAdventureOttos } from 'contexts/AdventureOttos'
import { AdventureOttoStatus } from 'models/AdventureOtto'
import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, Headline } from 'styles/typography'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 34px;
  background: ${({ theme }) => theme.colors.otterBlack};
  height: var(--game-body-height);
  overflow-y: auto;
`

const filters = ([undefined] as (AdventureOttoStatus | undefined)[]).concat(Object.values(AdventureOttoStatus))

const StyledTitle = styled(Headline).attrs({ as: 'h3' })`
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  width: 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    text-align: left;
  }
`

const StyledFilters = styled.div`
  text-align: center;
  padding: 5px;
`

const StyledOttoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const StyledFilterButton = styled(Caption).attrs({ as: 'button' })<{ selected?: boolean }>`
  background: transparent;
  color: ${({ theme, selected }) => (selected ? theme.colors.crownYellow : theme.colors.white)};

  &:not(:last-child) {
    position: relative;
    margin-right: 11px;

    &::after {
      position: absolute;
      top: 50%;
      right: 0;
      display: inline-block;
      content: '';
      width: 1px;
      height: 12px;
      transform: translate(6px, -7px);
      background: ${({ theme }) => theme.colors.white};
    }
  }
`

export default function OttoList() {
  const [selectedStatus, setSelectedStatus] = useState<AdventureOttoStatus | undefined>(undefined)
  const { t } = useTranslation()
  const { ottos } = useAdventureOttos()

  const filteredOttos = useMemo(() => {
    if (!selectedStatus) {
      return ottos
    }
    return ottos.filter(otto => otto.status === selectedStatus)
  }, [ottos, selectedStatus])

  return (
    <StyledContainer>
      <StyledTitle>{t('adventure.listTitle')}</StyledTitle>

      <StyledFilters>
        {filters.map((filter, i) => (
          <StyledFilterButton key={i} selected={selectedStatus === filter} onClick={() => setSelectedStatus(filter)}>
            {t(`adventureStatus.${filter ?? 'all'}`)}
          </StyledFilterButton>
        ))}
      </StyledFilters>

      <StyledOttoList>
        {filteredOttos.map(otto => (
          <AdventureOttoCard key={otto.id} otto={otto} />
        ))}
      </StyledOttoList>
    </StyledContainer>
  )
}
