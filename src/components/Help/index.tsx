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

const StyledContent = styled.div`
  display: inline-block;
`

export interface HelpProps {
  message: string
  className?: string
  noicon?: boolean
}

export default function Help({ className, children, message, noicon }: PropsWithChildren<HelpProps>) {
  const [id] = useState(() => `help-${nextId++}`)
  const [mounted, setMounted] = useState(false)

  // solve an ssr issue
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <StyledContainer>
      <StyledContent className={className} data-tip data-for={id}>
        {children}
        {!noicon && <StyledIcon src={InfoIcon.src} />}
      </StyledContent>
      {mounted && (
        <ReactTooltip id={id} effect="solid">
          <StyledNote>{message}</StyledNote>
        </ReactTooltip>
      )}
    </StyledContainer>
  )
}
