import { PropsWithChildren, useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import InfoIcon from './info.svg'

let nextId = 0

const StyledContainer = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
`

const StyledIcon = styled.img`
  width: 12px;
  height: 12px;
`

const StyledNote = styled(Note)`
  display: block;
  max-width: 300px;
  white-space: break-spaces;
`

export interface HelpProps {
  message: string
}

export default function Help({ children, message }: PropsWithChildren<HelpProps>) {
  const [id] = useState(() => `help-${nextId++}`)
  const [mounted, setMounted] = useState(false)

  // solve an ssr issue
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <StyledContainer>
      {children}
      <StyledIcon data-tip data-for={id} src={InfoIcon.src} />
      {mounted && (
        <ReactTooltip id={id} effect="solid">
          <StyledNote>{message}</StyledNote>
        </ReactTooltip>
      )}
    </StyledContainer>
  )
}
