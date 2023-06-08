import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import ItemCell from 'components/ItemCell'
import ItemCollectionBadge from 'components/ItemCollectionBadge'
import ItemRarityBadge from 'components/ItemRarityBadge'
import TraitLabels from 'components/TraitLabels'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { useOtto } from 'contexts/Otto'
import { useTrait } from 'contexts/TraitContext'
import useOnClickOutside from 'hooks/useOnClickOutside'
import { Item, ItemMetadata } from 'models/Item'
import { AdventureOttoStatus } from 'models/Otto'
import { useMyOtto } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import { memo, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components/macro'
import { ContentSmall, Headline, Note, Caption } from 'styles/typography'

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

const StyledRarityScore = styled(Note).attrs({ as: 'p' })``

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

const StyledWearCount = styled(Caption).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.darkGray100};
`

export interface ItemPreviewProps {
  metadata?: ItemMetadata
  selectedItem?: Item
  selectedItemId?: string
  onClose: () => void
  onItemUpdated?: () => void
}

export default memo(function ItemPreview({
  metadata,
  selectedItemId,
  selectedItem,
  onClose,
  onItemUpdated,
}: ItemPreviewProps) {
  const { traitType } = useTrait()
  const { otto, equipItem, removeItem } = useOtto()
  const { draftOtto } = useAdventureOtto()
  const { t } = useTranslation('', { keyPrefix: 'ottoItemsPopup' })
  const { t: tMyItems } = useTranslation('', { keyPrefix: 'my_items' })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const equippedItem = draftOtto?.equippedItems.find(item => item.metadata.type === traitType)
  const equippedOtto = useMyOtto(selectedItem?.equippedBy)
  const equippedByCurrentOtto = equippedOtto?.id === draftOtto?.id || selectedItemId?.startsWith('draft_')
  const nativeItem = otto?.ottoNativeTraits.find(nativeTrait => nativeTrait.type === traitType)
  const nativelyWornByCurrentOtto = otto?.wearableTraits.findIndex(trait => trait.id === nativeItem?.id) !== -1
  const equippedSameToken =
    equippedItem && selectedItem && equippedItem.metadata.tokenId === selectedItem.metadata.tokenId
  const unavailable =
    selectedItem &&
    equippedOtto &&
    equippedOtto.adventureStatus !== AdventureOttoStatus.Ready &&
    equippedOtto.adventureStatus !== AdventureOttoStatus.Resting

  const onEquip = (type: string, itemId: string) => {
    equipItem(type, itemId)
    onItemUpdated?.()
  }
  const onRemove = (type: string, toNative = false) => {
    removeItem(type, toNative)
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
                <StyledItemCollectionBadge collection={metadata.collection} collectionName={metadata.collectionName} />
              )}
              {metadata?.name}
            </StyledItemName>
            {metadata && (
              <StyledRarityScore>
                {tMyItems('total_rarity_score', {
                  total: metadata.totalRarityScore,
                  brs: metadata.baseRarityScore,
                  rrs: metadata.relativeRarityScore,
                })}
              </StyledRarityScore>
            )}
            {metadata && <TraitLabels highlightMatched metadata={metadata} />}
            <StyledWearCount>{t('equippedCount', { count: metadata?.equippedCount ?? 0 })}</StyledWearCount>
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
        {!equippedByCurrentOtto && metadata && selectedItemId !== 'native' && (
          <StyledButton
            disabled={unavailable || equippedSameToken}
            Typography={Headline}
            onClick={() => onEquip(metadata.type, metadata.tokenId)}
          >
            {t(unavailable ? 'unavailable' : 'wear')}
          </StyledButton>
        )}
        {!equippedByCurrentOtto && metadata && traitType && selectedItemId === 'native' && (
          <StyledButton
            disabled={!equippedItem}
            primaryColor="white"
            Typography={Headline}
            onClick={() => onRemove(traitType, !nativelyWornByCurrentOtto)}
          >
            {t('takeOff')}
          </StyledButton>
        )}
        {equippedByCurrentOtto && metadata && traitType && (
          <StyledButton
            disabled={metadata.unreturnable}
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
})
