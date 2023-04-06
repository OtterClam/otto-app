import BoostIcon from 'components/BoostIcon'
import { useAdventureLocation } from 'contexts/AdventureLocation'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { AttrBoostCondition, BoostType } from 'models/AdventureLocation'
import { useMemo } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled, { css } from 'styled-components/macro'
import { Note } from 'styles/typography'

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 1px;
`

const StyledLevel = styled(Note)<{ traitType?: string }>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  min-height: 36px;

  ${({ traitType }) =>
    traitType &&
    css<{ traitType?: string }>`
      &::before {
        content: attr(data-label);
        background: ${({ theme, traitType }) => traitType && theme.colors.attr?.[traitType]};
      }
    `}
`

const StyledBoostIcon = styled(BoostIcon)`
  position: absolute;
  right: -1px;
  bottom: 0;
`

const StyledSkeleton = styled(Skeleton).attrs({ borderRadius: 0 })`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

export interface Props {
  loading?: boolean
  className?: string
  levelClassName?: string
}

export default function OttoAttrs({ loading, className, levelClassName }: Props) {
  const location = useAdventureLocation()
  const { draftOtto: otto } = useAdventureOtto()

  const hasBoost = useMemo(() => {
    return (location?.conditionalBoosts ?? [])
      .filter(boost => boost.effective && boost.type === BoostType.FirstMatchGroup)
      .reduce((map, boost) => {
        const condition = boost.condition as AttrBoostCondition
        return Object.assign(map, { [condition.attr]: true })
      }, {} as { [k: string]: boolean })
  }, [location?.conditionalBoosts])

  if (loading || !otto) {
    return (
      <StyledContainer className={className}>
        <StyledLevel className={levelClassName}>
          <StyledSkeleton />
        </StyledLevel>
        <StyledLevel className={levelClassName}>
          <StyledSkeleton />
        </StyledLevel>
        <StyledLevel className={levelClassName}>
          <StyledSkeleton />
        </StyledLevel>
        <StyledLevel className={levelClassName}>
          <StyledSkeleton />
        </StyledLevel>
        <StyledLevel className={levelClassName}>
          <StyledSkeleton />
        </StyledLevel>
        <StyledLevel className={levelClassName}>
          <StyledSkeleton />
        </StyledLevel>
        <StyledLevel className={levelClassName}>
          <StyledSkeleton />
        </StyledLevel>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer className={className}>
      {otto?.displayAttrs?.map(trait => (
        <StyledLevel
          key={trait.trait_type}
          className={levelClassName}
          traitType={trait.trait_type}
          data-label={trait.trait_type}
        >
          {trait.value}
          {hasBoost[trait.trait_type.toLocaleLowerCase()] && <StyledBoostIcon />}
        </StyledLevel>
      ))}
    </StyledContainer>
  )
}
