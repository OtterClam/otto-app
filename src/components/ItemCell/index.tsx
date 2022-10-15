import CroppedImage from 'components/CroppedImage'
import Item from 'models/Item'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentLarge, Note } from 'styles/typography'
import chainedImage from './chained.svg'
import nonReturnableImage from './nonreturnable.png'
import selectedFrameCornerImage from './seelcted-frame-corner.svg'

const StyledItemCell = styled.button<{
  size?: number
  rarity?: string
  selected: boolean
  unavailable: boolean
  canClick: boolean
}>`
  --selected-bg: radial-gradient(63.75% 63.75% at 50% 50%, rgba(116, 205, 255, 0) 56.25%, #74cdff 100%);
  width: ${({ size }) => `${size || 115}px`};
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  position: relative;
  background: ${({ theme, rarity }) => (rarity ? (theme.colors.rarity as any)[rarity] : theme.colors.lightGray200)};
  z-index: 0;

  &::before {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  ${({ unavailable }) =>
    unavailable &&
    `
    &::after {
      content: '';
      display: block;
      position: absolute;
      z-index: 0;
      left: 3px;
      top: 3px;
      right: 3px;
      bottom: 3px;
      background: center / cover url(${chainedImage.src});
    }
  `}
`

const StyledSelectedFrame = styled.div<{ right?: boolean }>`
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    background: url(${selectedFrameCornerImage.src});
  }

  &::before {
    left: -4px;
    top: -4px;
  }

  &::after {
    transform: rotate(-90deg);
    left: -4px;
    bottom: -4px;
  }

  ${({ right }) =>
    right &&
    `
    transform: rotate(180deg);
  `}
`

const StyledImageContainer = styled.div`
  position: absolute;
  z-index: 0;
  top: 3px;
  left: 3px;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border-radius: 5px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  box-sizing: border-box;
  overflow: hidden;
`

const StyledRarity = styled.div<{ rarity?: string }>`
  position: absolute;
  z-index: 1;
  top: 3px;
  right: 3px;
  padding-left: 3px;
  background-color: ${({ theme, rarity }) =>
    rarity ? (theme.colors.rarity as any)[rarity] : theme.colors.lightGray200};
  border-left: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-bottom: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 1px;
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledAmount = styled.div`
  z-index: 1;
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
`

const StyledEquipped = styled.div`
  position: absolute;
  z-index: 1;
  left: -2px;
  bottom: -2px;
  padding: 2px 6px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.darkGray300};
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 0 5px 5px 5px;
`

const StyledUnreturnable = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 0;
  left: -2px;
  top: -2px;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.white};

  &::before {
    content: '';
    width: 18px;
    height: 18px;
    background: center / cover url(${nonReturnableImage.src});
  }
`

interface Props {
  item?: Item
  currentOtto?: Otto
  unavailable?: boolean
  size?: number
  selected?: boolean
  onClick?: () => void
  className?: string
  hideAmount?: boolean
}

export default function ItemCell({
  item,
  currentOtto,
  unavailable = false,
  size,
  selected = false,
  onClick,
  className,
  hideAmount = false,
}: Props) {
  const { t } = useTranslation()
  const { id, image, rarity, equipped, amount = 0, unreturnable } = item ?? {}
  const equippedByCurrentOtto = (!currentOtto || currentOtto?.wearableTraits.find(trait => trait.id === id)) && equipped

  return (
    <StyledItemCell
      size={size}
      rarity={rarity}
      unavailable={unavailable && !equippedByCurrentOtto}
      selected={selected}
      canClick={Boolean(onClick)}
      className={className}
      onClick={onClick}
    >
      <StyledImageContainer>{image && <CroppedImage src={image} layout="fill" />}</StyledImageContainer>
      <StyledRarity rarity={rarity}>
        <Note>{rarity}</Note>
      </StyledRarity>
      {amount > 1 && !hideAmount && (
        <StyledAmount>
          <ContentLarge>{amount}</ContentLarge>
        </StyledAmount>
      )}
      {equipped && (
        <StyledEquipped>
          <Note>{t('my_items.equipped')}</Note>
        </StyledEquipped>
      )}
      {selected && (
        <>
          <StyledSelectedFrame />
          <StyledSelectedFrame right />
        </>
      )}
      {(unreturnable || !id) && <StyledUnreturnable />}
    </StyledItemCell>
  )
}
