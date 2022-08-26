import CroppedImage from 'components/CroppedImage'
import Otto from 'models/Otto'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import FeedButton from './FeedButton'
import TraitButton from './TraitButton'
import { TraitProvider, useTrait } from './TraitContext'
import ribbonImage from './ribbon.png'

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

const StyledName = styled(Note)`
  width: fit-content;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 ${ribbonImage.width / 2}px -4px ${ribbonImage.width / 2}px;
  background: ${({ theme }) => theme.colors.crownYellow};
  border: 2px ${({ theme }) => theme.colors.otterBlack} solid;
  border-left: none;
  border-right: none;
  height: 24px;
  box-sizing: border-box;

  &::before,
  &::after {
    position: absolute;
    top: -2px;
    content: '';
    width: ${ribbonImage.width / 2}px;
    height: ${ribbonImage.height / 2}px;
    background: center / cover url(${ribbonImage.src});
  }

  &::before {
    left: -${ribbonImage.width / 2}px;
  }

  &::after {
    transform: rotateY(180deg);
    right: -${ribbonImage.width / 2}px;
  }
`

export interface OttoPreviewerProps {
  otto?: Otto
}

export default function OttoPreviewer({ otto }: OttoPreviewerProps) {
  const { setTrait: selectTrait } = useTrait()

  return (
    <TraitProvider>
      <StyledContainer>
        <StyledPreview>
          <StyledTraitGroup>
            {otto?.wearableTraits?.map(trait => (
              <TraitButton trait={trait} key={trait.id} onSelect={selectTrait} />
            ))}
          </StyledTraitGroup>

          <StyledPreviewImage>
            <StyledName>{otto?.name}</StyledName>
            {otto && <CroppedImage key={otto.tokenId} src={otto.image} width={200} height={200} />}
          </StyledPreviewImage>

          <StyledTraitGroup>
            {otto?.geneticTraits
              ?.filter(trait => trait.image)
              ?.map(trait => (
                <TraitButton locked trait={trait} key={trait.id} onSelect={selectTrait} />
              ))}
            <FeedButton />
          </StyledTraitGroup>
        </StyledPreview>
      </StyledContainer>
    </TraitProvider>
  )
}
