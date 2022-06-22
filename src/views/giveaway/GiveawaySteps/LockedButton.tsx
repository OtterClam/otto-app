import LockedIcon from 'assets/ui/locked.svg'
import Button from 'components/Button'
import { Fragment } from 'react'
import styled from 'styled-components/macro'

const StyledLockedButton = styled(Button)`
  img {
    width: 20px;
    height: 20px;
  }
`

export default function LockedButton() {
  return (
    <StyledLockedButton disabled padding="6px 10px" Typography={Fragment}>
      <img src={LockedIcon.src} alt="locked" />
    </StyledLockedButton>
  )
}
