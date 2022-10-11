import Button from 'components/Button'
import { ChangeEventHandler, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentExtraSmall, ContentMedium } from 'styles/typography'

const StyledContainer = styled.div`
  display: flex;
  gap: 10px;
`

const StyledInputContainer = styled.div``

const StyledAttr = styled(ContentExtraSmall)<{ attr: string }>`
  border-radius: 10px 0px 0px 10px;
  background: ${({ theme, attr }) => theme.colors.attr[attr]};
`

const StyedInput = styled(ContentExtraSmall).attrs({ as: 'input' })<{ value: number }>`
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 0 10px 10px 0;
`

export interface PointInputProps {
  attr: string
  availablePoints: number
  currentPoints: number
  onChange: (attr: string, points: number) => void
}

export default function PointInput({ attr, availablePoints, currentPoints, onChange }: PointInputProps) {
  const [points, setPoints] = useState(currentPoints)

  const handleChangeEvent: ChangeEventHandler<HTMLInputElement> = e => {
    const newPoints = Number(e.currentTarget.value)
    setPoints(newPoints)
    onChange(attr, newPoints)
  }

  return (
    <StyledContainer>
      <StyledInputContainer>
        <StyledAttr attr={attr}>{attr.toLocaleUpperCase()}</StyledAttr>
        <StyedInput value={points} onChange={handleChangeEvent} />
      </StyledInputContainer>

      <Button disabled={points <= currentPoints} Typography={ContentMedium}>
        -
      </Button>

      <Button disabled={!availablePoints} Typography={ContentMedium}>
        +
      </Button>
    </StyledContainer>
  )
}
