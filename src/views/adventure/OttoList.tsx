import AdventureOttoCard from 'components/AdventureOttoCard'
import { AdventureOttoStatus } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, Headline } from 'styles/typography'

const StyledContainer = styled.div<{ maxHeight?: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 34px;
  box-sizing: border-box;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.otterBlack};

  ${({ maxHeight }) =>
    maxHeight &&
    `
    height: ${maxHeight}px;
  `}
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

export default function OttoList({ maxHeight }: { maxHeight?: number }) {
  const [selectedStatus, setSelectedStatus] = useState<AdventureOttoStatus | undefined>(undefined)
  const { t } = useTranslation()
  const { ottos } = useMyOttos()
  const filteredOttos = useMemo(() => {
    if (!selectedStatus) {
      return ottos
    }
    return ottos.filter(otto => otto.adventureStatus === selectedStatus)
  }, [ottos, selectedStatus])

  return (
    <StyledContainer maxHeight={maxHeight}>
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
