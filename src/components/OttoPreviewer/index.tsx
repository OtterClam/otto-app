import CroppedImage from 'components/CroppedImage'
import styled from 'styled-components/macro'
import OttoItemsPopup from 'components/OttoItemsPopup'
import { useCallback, useMemo } from 'react'
import AdventureRibbonText from 'components/AdventureRibbonText'
import { useOtto } from 'contexts/Otto'
import { useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useApiCall } from 'contexts/Api'
import { AdventureLocationProvider } from 'contexts/AdventureLocation'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { Trait } from 'models/Otto'
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

const StyledOttoItemsPopup = styled(OttoItemsPopup)<{ offsetX: number }>`
  transform: translateX(${({ offsetX }) => offsetX}px);
`

const wearableTraitTypes = ['Holding', 'Headwear', 'Facial Accessories', 'Clothes', 'Background']

export interface OttoPreviewerProps {
  itemsPopupWidth: number
  itemPopupHeight?: number
  itemPopupOffset: number
}

export default function OttoPreviewer({ itemsPopupWidth, itemPopupHeight, itemPopupOffset }: OttoPreviewerProps) {
  const { draftOtto: otto } = useAdventureOtto()
  const { setTraitType: selectTrait } = useTrait()
  const wearableTraits: { type: string; trait?: Trait }[] = useMemo(() => {
    if (!otto) {
      return wearableTraitTypes.map(type => ({ type }))
    }
    const typeToTrait = otto.wearableTraits.reduce(
      (map, trait) => Object.assign(map, { [trait.type]: trait }),
      {} as { [k: string]: Trait }
    )
    return wearableTraitTypes.map(type => ({
      type,
      trait: typeToTrait[type],
    }))
  }, [otto])

  const close = useCallback(() => {
    selectTrait(undefined)
  }, [])

  return (
    <>
      <StyledContainer>
        <StyledPreview>
          <StyledTraitGroup>
            {otto &&
              wearableTraits.map(({ type, trait }) => (
                <TraitButton type={type} trait={trait} key={otto.tokenId + type} onSelect={selectTrait} />
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
                <TraitButton
                  locked
                  type={trait.type}
                  trait={trait}
                  key={otto.tokenId + trait.type}
                  onSelect={selectTrait}
                />
              ))}
            <FeedButton />
          </StyledTraitGroup>
        </StyledPreview>
      </StyledContainer>

      <StyledOttoItemsPopup
        offsetX={itemPopupOffset}
        onRequestClose={close}
        maxWidth={itemsPopupWidth}
        height={itemPopupHeight}
      />
    </>
  )
}
