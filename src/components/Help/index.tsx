import { PropsWithChildren, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
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

const StyledReactTooltip = styled(ReactTooltip)`
  &.place-top {
    z-index: 10000;
  }
`

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
  const [modalRoot, setModalRoot] = useState<Element | null>(null)

  // solve an ssr issue
  useEffect(() => {
    setMounted(true)
    setModalRoot(document.querySelector('#modal-root'))
  }, [])

  return (
    <StyledContainer>
      <StyledContent className={className} data-tip data-for={id}>
        {children}
        {!noicon && <StyledIcon src={icon} />}
      </StyledContent>
      {mounted &&
        ReactDOM.createPortal(
          <StyledReactTooltip id={id} effect="solid">
            <StyledNote>{message}</StyledNote>
          </StyledReactTooltip>,
          modalRoot ?? document.body
        )}
    </StyledContainer>
  )
}
