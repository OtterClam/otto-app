import Button from 'components/Button'
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentExtraSmall, ContentMedium } from 'styles/typography'

const StyledContainer = styled.div`
  display: flex;
  align-items: scratch;
  justify-content: space-between;
  gap: 10px;
  height: 34px;
`

const StyledInputContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: scratch;
`

const StyledAttr = styled(ContentExtraSmall)<{ attr: string }>`
  flex: 0 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  max-width: 60px;
  border-radius: 10px 0px 0px 10px;
  background: ${({ theme, attr }) => theme.colors.attr[attr.toLocaleUpperCase()]};
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyedValue = styled(ContentExtraSmall)<{ updated: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  border-radius: 0 10px 10px 0;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme, updated }) => (updated ? theme.colors.otterBlue : theme.colors.otterBlack)};
  padding: 0 10px;
  gap: 4px;
`

const StyledButton = styled(Button)`
  max-width: 40px;
  min-width: 40px;
  margin: -4px;
`

export interface PointInputProps {
  disabled?: boolean
  attr: string
  availablePoints: number
  currentPoints: number
  updatedPoints: number
  onChange: (attr: string, points: number) => void
}

export default function PointInput({
  disabled,
  attr,
  availablePoints,
  currentPoints,
  updatedPoints,
  onChange,
}: PointInputProps) {
  const increase = useCallback(() => {
    onChange(attr, 1)
  }, [onChange])

  const decrease = useCallback(() => {
    onChange(attr, -1)
  }, [onChange])

  return (
    <StyledContainer>
      <StyledInputContainer>
        <StyledAttr attr={attr}>{attr.toLocaleUpperCase()}</StyledAttr>
        <StyedValue updated={updatedPoints > currentPoints}>
          {currentPoints}
          {updatedPoints > currentPoints && <span>(+{updatedPoints - currentPoints})</span>}
        </StyedValue>
      </StyledInputContainer>

      <StyledButton
        onClick={decrease}
        padding="0"
        disabled={disabled || updatedPoints === currentPoints}
        Typography={ContentMedium}
      >
        -
      </StyledButton>

      <StyledButton onClick={increase} padding="0" disabled={disabled || !availablePoints} Typography={ContentMedium}>
        +
      </StyledButton>
    </StyledContainer>
  )
}
