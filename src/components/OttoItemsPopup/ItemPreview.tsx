import AdventureStatus from 'components/AdventureStatus'
import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import CroppedImage from 'components/CroppedImage'
import ItemCell from 'components/ItemCell'
import ItemCollectionBadge from 'components/ItemCollectionBadge'
import ItemRarityBadge from 'components/ItemRarityBadge'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { useMyItem } from 'contexts/MyItems'
import { useOtto } from 'contexts/Otto'
import { useTrait } from 'contexts/TraitContext'
import useOnClickOutside from 'hooks/useOnClickOutside'
import { ItemMetadata } from 'models/Item'
import { AdventureOttoStatus } from 'models/Otto'
import { useMyOtto } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import { memo, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components/macro'
import { ContentSmall, Headline, Note } from 'styles/typography'

const StyledItemPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px ${({ theme }) => theme.colors.otterBlack} solid;

  &.slide-enter {
    transform: translateY(100px);
    opacity: 0.1;
  }

  &.slide-enter-active {
    transform: translateY(0);
    opacity: 1;
    transition: transform 0.2s, opacity 0.2s;
  }

  &.slide-exit {
    transform: translateY(0);
    opacity: 1;
  }

  &.slide-exit-active {
    transform: translateY(100px);
    opacity: 0.1;
    transition: transform 0.2s, opacity 0.2s;
  }
`

const StyledItemPreviewDetails = styled.div`
  display: flex;
  gap: 10px;
`

const StyledItemImage = styled.div`
  flex: 0;
`

const StyledItemAttrs = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: start;
`

const StyledItemCollectionBadge = styled(ItemCollectionBadge)`
  width: 30px;
  height: 30px;
`

const StyledItemName = styled(ContentSmall)`
  display: flex;
  gap: 5px;
  align-items: center;
`

const StyledItemLevels = styled(Note).attrs({ as: 'div' })`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px 10px;
`

const StyledItemLevel = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledItemLevelLabel = styled.div``

const StyledItemLevelValue = styled.div``

const StyledButton = styled(Button)`
  width: 100%;
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  right: 10px;
  top: 10px;
`

export interface ItemPreviewProps {
  metadata?: ItemMetadata
  selectedItemId?: string
  onClose: () => void
  onItemUpdated?: () => void
}

export default memo(
  function ItemPreview({ metadata, selectedItemId, onClose, onItemUpdated }: ItemPreviewProps) {
    const { traitType } = useTrait()
    const { equipItem, removeItem } = useOtto()
    const { draftOtto: otto } = useAdventureOtto()
    const { t } = useTranslation('', { keyPrefix: 'ottoItemsPopup' })
    const containerRef = useRef<HTMLDivElement | null>(null)
    const equippedItem = otto?.equippedItems.find(item => item.metadata.type === traitType)
    const selectedItem = useMyItem(selectedItemId)
    const equippedOtto = useMyOtto(selectedItem?.equippedBy)
    const equippedByCurrentOtto = equippedOtto?.id === otto?.id
    const equippedSameToken =
      equippedItem && selectedItem && equippedItem.metadata.tokenId === selectedItem.metadata.tokenId
    const unavailable = selectedItem && equippedOtto && equippedOtto.adventureStatus !== AdventureOttoStatus.Ready

    const onEquip = (type: string, itemId: string) => {
      equipItem(type, itemId)
      onItemUpdated?.()
    }
    const onRemove = (type: string) => {
      removeItem(type)
      onItemUpdated?.()
    }

    useOnClickOutside(containerRef, onClose)

    return (
      <CSSTransition in={selectedItemId !== undefined} unmountOnExit timeout={200} classNames="slide">
        <StyledItemPreview ref={containerRef}>
          <StyledCloseButton onClose={onClose} />
          <StyledItemPreviewDetails>
            <StyledItemImage>
              <ItemCell hideAmount metadata={metadata} />
            </StyledItemImage>
            <StyledItemAttrs>
              {metadata && <ItemRarityBadge rarity={metadata.rarity} />}
              <StyledItemName>
                {metadata?.collection && metadata?.collectionName && (
                  <StyledItemCollectionBadge
                    collection={metadata.collection}
                    collectionName={metadata.collectionName}
                  />
                )}
                {metadata?.name}
              </StyledItemName>
              <StyledItemLevels>
                {Object.entries(metadata?.stats ?? {}).map(([name, value]) => (
                  <StyledItemLevel key={name}>
                    <StyledItemLevelLabel>{name}</StyledItemLevelLabel>
                    <StyledItemLevelValue>{value}</StyledItemLevelValue>
                  </StyledItemLevel>
                ))}
              </StyledItemLevels>
            </StyledItemAttrs>
          </StyledItemPreviewDetails>
          {!equippedByCurrentOtto && metadata && (
            <StyledButton
              disabled={unavailable || equippedSameToken}
              Typography={Headline}
              onClick={() => onEquip(metadata.type, metadata.tokenId)}
            >
              {t(unavailable ? 'unavailable' : 'wear')}
            </StyledButton>
          )}
          {equippedByCurrentOtto && metadata && traitType && (
            <StyledButton
              disabled={metadata.unreturnable || selectedItemId === 'native'}
              primaryColor="white"
              Typography={Headline}
              onClick={() => onRemove(traitType)}
            >
              {t(metadata?.unreturnable ? 'unavailable' : 'takeOff')}
            </StyledButton>
          )}
          {selectedItemId === 'empty' && traitType && (
            <StyledButton
              disabled={!equippedItem}
              primaryColor="white"
              Typography={Headline}
              onClick={() => onRemove(traitType)}
            >
              {t('takeOff')}
            </StyledButton>
          )}
        </StyledItemPreview>
      </CSSTransition>
    )
  },
  (a, b) => a.selectedItemId === b.selectedItemId
)
