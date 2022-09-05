import Item from 'models/Item'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentLarge, Note } from 'styles/typography'
import SelectedFrame from './selected-frame.svg'

const StyledItemCell = styled.button<{ rarity: string; selected: boolean; canClick: boolean }>`
  --selected-bg: radial-gradient(63.75% 63.75% at 50% 50%, rgba(116, 205, 255, 0) 56.25%, #74cdff 100%);
  width: 115px;
  height: 115px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
  position: relative;
  z-index: 0;

  background: ${({ canClick, selected }) => (canClick ? (selected ? 'var(--selected-bg)' : 'white') : 'white')};
};

  &:hover {
    background: ${({ canClick }) => (canClick ? 'var(--selected-bg)' : 'white')}
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
  z-index: 15;
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
  color: ${({ theme }) => theme.colors.otterBlack};
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

const StyledEquipped = styled.div`
  position: absolute;
  left: -2px;
  bottom: -2px;
  padding: 2px 6px;
  z-index: 13;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.darkGray300};
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 5px;
`

interface Props {
  item: Item
  selected?: boolean
  onClick?: () => void
  className?: string
}

export default function ItemCell({
  item: { image, rarity, equipped, amount },
  selected = false,
  onClick,
  className,
}: Props) {
  const { t } = useTranslation()
  return (
    <StyledItemCell
      rarity={rarity}
      selected={selected}
      canClick={Boolean(onClick)}
      className={className}
      onClick={onClick}
    >
      <StyledImage src={image} />
      <StyledRarity rarity={rarity}>
        <Note>{rarity}</Note>
      </StyledRarity>
      {amount > 1 && (
        <StyledAmount>
          <ContentLarge>{amount}</ContentLarge>
        </StyledAmount>
      )}
      {equipped && (
        <StyledEquipped>
          <Note>{t('my_items.equipped')}</Note>
        </StyledEquipped>
      )}
      {selected && <StyledSelectedFrame src={SelectedFrame.src} />}
    </StyledItemCell>
  )
}
