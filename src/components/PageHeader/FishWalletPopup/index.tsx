import BorderContainer from 'components/BorderContainer'
import { RefObject, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { hideFishWalletPopup, selectShowFishWalletPopup } from 'store/uiSlice'
import styled from 'styled-components/macro'
import Swap from './Swap'

const StyledPopup = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: fixed;
  top: env(safe-area-inset-top);
  right: env(safe-area-inset-right);
  bottom: env(safe-area-inset-bottom);
  left: env(safe-area-inset-left);
  justify-content: center;
  align-items: center;
  z-index: var(--z-index-popup);
`

const StyledBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
  }
`

const StyledWalletPopup = styled.div<{ top: number; left: number }>`
  width: 320px;
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    position: static;
    width: 90%;
  }
`

const StyledBorderContainer = styled(BorderContainer)`
  overflow: hidden;
`

const StyledSwap = styled(Swap)``

interface Props {
  alignRef?: RefObject<HTMLDivElement>
  className?: string
}

export default function FishWalletPopup({ alignRef, className }: Props) {
  const show = useSelector(selectShowFishWalletPopup)
  const dispatch = useDispatch()
  const onClose = () => dispatch(hideFishWalletPopup())

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [show])

  const { left, bottom } = alignRef?.current?.getBoundingClientRect() || { left: 0, bottom: 0 }

  if (show) {
    const dom = (
      <StyledPopup show={show}>
        <StyledBackground onClick={onClose} />
        <StyledWalletPopup className={className} top={bottom} left={left}>
          <StyledBorderContainer size="xs">
            <StyledSwap onClose={onClose} />
          </StyledBorderContainer>
        </StyledWalletPopup>
      </StyledPopup>
    )
    return ReactDOM.createPortal(dom, document.querySelector('#modal-root') ?? document.body)
  }
  return null
}
