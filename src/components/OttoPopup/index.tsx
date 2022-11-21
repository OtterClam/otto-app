import AdventureFullscreen from 'components/AdventureFullscreen'
import { useMyItems } from 'contexts/MyItems'
import { useOtto, withOtto } from 'contexts/Otto'
import { withTrait } from 'contexts/TraitContext'
import { useMyOtto } from 'MyOttosProvider'
import { useCallback, useEffect } from 'react'
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
    }, [])

    useEffect(() => {
      setOtto(otto)
      if (otto) {
        refreshMyItems()
      } else {
        resetEquippedItems()
      }
    }, [otto])

    return (
      <StyledAdventureFullscreen show={Boolean(otto)} onRequestClose={closePopup} closeButtonColor="white">
        <Body />
      </StyledAdventureFullscreen>
    )
  })
)
