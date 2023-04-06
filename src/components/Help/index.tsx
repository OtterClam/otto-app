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

const tooltipOverridePosition = (
  { left, top }: { left: number; top: number },
  _currentEvent: Event,
  _currentTarget: EventTarget,
  node: HTMLSpanElement | HTMLDivElement | null
) => {
  if (node) {
    const d = document.documentElement
    left = Math.min(d.clientWidth - node.clientWidth, left)
    top = Math.min(d.clientHeight - node.clientHeight, top)
    left = Math.max(0, left)
    top = Math.max(0, top)
  }
  return { top, left }
}

export interface HelpProps {
  message: string
  className?: string
  noicon?: boolean
  icon?: string
}

export default function Help({
  className,
  children,
  message,
  icon = InfoIcon.src,
  noicon,
}: PropsWithChildren<HelpProps>) {
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
        {!noicon && <StyledIcon src={icon} />}
      </StyledContent>
      {mounted && (
        <ReactTooltip id={id} overridePosition={tooltipOverridePosition} effect="solid">
          <StyledNote>{message}</StyledNote>
        </ReactTooltip>
      )}
    </StyledContainer>
  )
}
