import AdventureFullscreen from 'components/AdventureFullscreen'
import { useMyItems } from 'contexts/MyItems'
import { useOtto, withOtto } from 'contexts/Otto'
import { withTrait } from 'contexts/TraitContext'
import { useMyOtto } from 'MyOttosProvider'
import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideOttoPopup, selectOttoPopup } from 'store/uiSlice'
import styled from 'styled-components/macro'
import Body from './Body'

const StyledAdventureFullscreen = styled(AdventureFullscreen)`
  max-width: 880px !important;
  background-color: ${({ theme }) => theme.colors.darkGray400} !important;
`

export default withOtto(
  withTrait(function OttoPopup() {
    const { refetch: refreshMyItems } = useMyItems()
    const { setOtto, resetEquippedItems } = useOtto()
    const dispatch = useDispatch()
    const ottoTokenId = useSelector(selectOttoPopup)
    const otto = useMyOtto(ottoTokenId)

    const closePopup = useCallback(() => {
      dispatch(hideOttoPopup())
    }, [dispatch])

    const prevOtto = useRef(otto)

    useEffect(() => {
      setOtto(otto)
      prevOtto.current = otto
    }, [otto, setOtto])

    useEffect(() => {
      if (prevOtto.current && !otto) {
        resetEquippedItems?.()
      } else if (!prevOtto.current && otto) {
        refreshMyItems?.()
      }
      prevOtto.current = otto
    }, [otto, refreshMyItems, resetEquippedItems])

    return (
      <StyledAdventureFullscreen show={Boolean(otto)} onRequestClose={closePopup} closeButtonColor="white">
        <Body />
      </StyledAdventureFullscreen>
    )
  })
)
