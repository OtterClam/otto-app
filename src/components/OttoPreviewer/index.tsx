import styled from 'styled-components/macro'
import OttoItemsPopup from 'components/OttoItemsPopup'
import { useCallback, useMemo } from 'react'
import AdventureRibbonText from 'components/AdventureRibbonText'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { Trait } from 'models/Otto'
import { useBreakpoints } from 'contexts/Breakpoints'
import OttoLoadingPlaceholder from 'assets/ui/otto-loading.jpg'
import Image from 'next/image'
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

const StyledOttoItemsPopup = styled(OttoItemsPopup)<{ offsetX: number; width?: string }>`
  transform: translateX(${({ offsetX }) => offsetX}px);
  ${({ width }) =>
    width &&
    `
    width: ${width};
  `}
`

const wearableTraitTypes = ['Holding', 'Headwear', 'Facial Accessories', 'Clothes', 'Background']

export interface OttoPreviewerProps {
  itemsPopupWidth: number
  itemPopupHeight?: number
  itemPopupOffset: number
}

export default function OttoPreviewer({ itemsPopupWidth, itemPopupHeight, itemPopupOffset }: OttoPreviewerProps) {
  const { isSmallTablet, isMobile } = useBreakpoints()
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
                <TraitButton type={type} trait={trait} key={otto.id + type} onSelect={selectTrait} />
              ))}
          </StyledTraitGroup>

          <StyledPreviewImage>
            <AdventureRibbonText>{otto?.name}</AdventureRibbonText>
            <StyledImageContainer>
              <Image
                key={otto?.id}
                src={otto ? otto.image : OttoLoadingPlaceholder}
                layout="fill"
                width={200}
                height={200}
              />
            </StyledImageContainer>
          </StyledPreviewImage>

          <StyledTraitGroup>
            {otto?.geneticTraits
              ?.filter(trait => trait.image)
              ?.map(trait => (
                <TraitButton locked type={trait.type} trait={trait} key={otto.id + trait.type} onSelect={selectTrait} />
              ))}
            <FeedButton />
          </StyledTraitGroup>
        </StyledPreview>
      </StyledContainer>

      <StyledOttoItemsPopup
        offsetX={isSmallTablet ? 0 : itemPopupOffset}
        onRequestClose={close}
        width={isSmallTablet && !isMobile ? '80%' : undefined}
        maxWidth={isSmallTablet ? undefined : itemsPopupWidth}
      />
    </>
  )
}
