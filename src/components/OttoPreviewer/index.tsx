import CroppedImage from 'components/CroppedImage'
import styled from 'styled-components/macro'
import OttoItemsPopup from 'components/OttoItemsPopup'
import { useCallback } from 'react'
import AdventureRibbonText from 'components/AdventureRibbonText'
import { useOtto } from 'contexts/Otto'
import { useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useApiCall } from 'contexts/Api'
import { AdventureLocationProvider } from 'contexts/AdventureLocation'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { useTrait } from '../../contexts/TraitContext'
import TraitButton from './TraitButton'
import FeedButton from './FeedButton'

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`

const StyledPreview = styled.div`
  display: flex;
  gap: 24px;
`

const StyledPreviewImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledTraitGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const StyledImageContainer = styled.div`
  position: relative;
  min-width: 200px;
  max-width: 200px;
  height: 200px;
`

export default function OttoPreviewer() {
  const { draftOtto: otto } = useAdventureOtto()
  const { setTrait: selectTrait } = useTrait()

  const close = useCallback(() => {
    selectTrait(undefined)
  }, [])

  return (
    <>
      <StyledContainer>
        <StyledPreview>
          <StyledTraitGroup>
            {otto?.wearableTraits?.map(trait => (
              <TraitButton trait={trait} key={otto.tokenId + trait.id} onSelect={selectTrait} />
            ))}
          </StyledTraitGroup>

          <StyledPreviewImage>
            <AdventureRibbonText>{otto?.name}</AdventureRibbonText>
            <StyledImageContainer>
              {otto && <CroppedImage key={otto.tokenId} src={otto.image} layout="fill" />}
            </StyledImageContainer>
          </StyledPreviewImage>

          <StyledTraitGroup>
            {otto?.geneticTraits
              ?.filter(trait => trait.image)
              ?.map(trait => (
                <TraitButton locked trait={trait} key={otto.tokenId + trait.id} onSelect={selectTrait} />
              ))}
            <FeedButton />
          </StyledTraitGroup>
        </StyledPreview>
      </StyledContainer>

      <OttoItemsPopup onRequestClose={close} />
    </>
  )
}
