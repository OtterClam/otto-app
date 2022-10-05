import BoostIcon from 'components/BoostIcon'
import { useAdventureLocation } from 'contexts/AdventureLocation'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { AttrBoostCondition, BoostType } from 'models/AdventureLocation'
import { useMemo } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 1px;
`

const StyledLevel = styled(Note)<{ traitType: string }>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;

  &::before {
    content: attr(data-label);
    background: ${({ theme, traitType }) => theme.colors.attr[traitType]};
  }
`

const StyledBoostIcon = styled(BoostIcon)`
  position: absolute;
  right: -1px;
  bottom: 0;
`

export interface OttoLevelsProps {
  className?: string
  levelClassName?: string
}

export default function OttoLevels({ className, levelClassName }: OttoLevelsProps) {
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
