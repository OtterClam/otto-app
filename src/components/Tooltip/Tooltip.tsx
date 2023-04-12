import { useState, useEffect, ReactChild, ReactElement, cloneElement } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

let nextId = 0

const StyledTooltip = styled(Note.withComponent(ReactTooltip))`
  color: ${({ theme }) => theme.colors.white} !important;
  background: ${({ theme }) => theme.colors.otterBlack} !important;
  padding: 3px 10px !important;
  text-align: center;
  opacity: 1 !important;
`

export interface TooltipProps {
  content: ReactChild
  children: ReactElement
  place?: 'left' | 'right' | 'top' | 'bottom'
}

export default function Tooltip({ content, children, place }: TooltipProps) {
  const [id] = useState(() => `tooltip-${nextId++}`)
  const [mounted, setMounted] = useState(false)

  // solve an ssr issue
  useEffect(() => {
    setMounted(true)
  }, [])

  const child = cloneElement(children, {
    'data-tip': true,
    'data-for': id,
  })

  return (
    <>
      {child}
      {mounted && (
        <StyledTooltip id={id} place={place} effect="solid">
          {content}
        </StyledTooltip>
      )}
    </>
  )
}
