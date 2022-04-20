import Item from 'models/Item'
import styled from 'styled-components/macro'
import { ContentLarge, Note } from 'styles/typography'
import SelectedFrame from './selected-frame.svg'

const StyledItemCell = styled.div<{ rarity: string; selected: boolean }>`
  --selected-bg: radial-gradient(63.75% 63.75% at 50% 50%, rgba(116, 205, 255, 0) 56.25%, #74cdff 100%);
  width: 115px;
  height: 115px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  position: relative;

  background: ${({ selected }) => (selected ? 'var(--selected-bg)' : 'transparent')};
};

  &:hover {
    background: var(--selected-bg)
  }

  &:before {
    content: ' ';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border: 5px solid ${({ theme, rarity }) => (theme.colors.rarity as any)[rarity]};
    border-radius: 3px;
    pointer-events: none;
  }

  &:after {
    content: ' ';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 2px solid ${({ theme }) => theme.colors.otterBlack};
    pointer-events: none;
  }
`

const StyledSelectedFrame = styled.img`
  position: absolute;
  top: -4px;
  left: -4px;
  z-index: 11;
`

const StyledImage = styled.img`
  width: 100%;
  border-radius: 5px;
`

const StyledRarity = styled.div<{ rarity: string }>`
  z-index: 10;
  position: absolute;
  top: 3px;
  right: 3px;
  padding-left: 3px;
  background-color: ${({ theme, rarity }) => (theme.colors.rarity as any)[rarity]};
  border-left: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-bottom: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 1px;
`

const StyledAmount = styled.div`
  z-index: 12;
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

interface Props {
  item: Item
  amount: number
  selected: boolean
  onClick: () => void
}

export default function ItemCell({ item: { image, rarity }, amount, selected, onClick }: Props) {
  return (
    <StyledItemCell rarity={rarity} selected={selected} onClick={onClick}>
      <StyledImage src={image} />
      <StyledRarity rarity={rarity}>
        <Note>{rarity}</Note>
      </StyledRarity>
      {amount > 1 && (
        <StyledAmount>
          <ContentLarge>{amount}</ContentLarge>
        </StyledAmount>
      )}
      {selected && <StyledSelectedFrame src={SelectedFrame} />}
    </StyledItemCell>
  )
}
