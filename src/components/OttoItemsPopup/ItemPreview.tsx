import Button from 'components/Button'
import CroppedImage from 'components/CroppedImage'
import ItemCell from 'components/ItemCell'
import ItemCollectionBadge from 'components/ItemCollectionBadge'
import ItemRarityBadge from 'components/ItemRarityBadge'
import { useAdventureOtto } from 'contexts/AdventureOtto'
import { useOtto } from 'contexts/Otto'
import useAdventureOttosWithItem from 'hooks/useAdventureOttosWithItem'
import useOnClickOutside from 'hooks/useOnClickOutside'
import Item from 'models/Item'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import { memo, useMemo, useRef } from 'react'
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

const StyledOttos = styled.div``

const StyledOtto = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`

const StyledOttoImage = styled.div`
  flex: 0 18px;
  position: relative;
  border-radius: 9px;
  max-width: 18px;
  max-width: 18px;
  height: 18px;
`

const useOttos = (item?: Item, selectedOtto?: Otto) => {
  const ottos = useAdventureOttosWithItem(item?.id ?? '')
  const ottosExceptSelectedOtto = useMemo(() => {
    return ottos.filter(otto => String(otto.id) !== selectedOtto?.id)
  }, [item, selectedOtto])
  return ottosExceptSelectedOtto
}

export interface ItemPreviewProps {
  item?: Item
  onClose: () => void
  onItemUpdated?: () => void
  unavailable?: boolean
}

export default memo(
  function ItemPreview({ item, onClose, onItemUpdated, unavailable = false }: ItemPreviewProps) {
    const { equipItem, removeItem } = useOtto()
    const { draftOtto: otto } = useAdventureOtto()
    const { t } = useTranslation('', { keyPrefix: 'ottoItemsPopup' })
    const containerRef = useRef<HTMLDivElement | null>(null)
    const ottos = useOttos(item, otto)
    const equippedByCurrentOtto = Boolean(otto?.wearableTraits.find(trait => trait.id === item?.id))

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
      <CSSTransition in={Boolean(item)} unmountOnExit timeout={200} classNames="slide">
        <StyledItemPreview ref={containerRef}>
          {item && (
            <>
              <StyledItemPreviewDetails>
                <StyledItemImage>
                  <ItemCell hideAmount item={item} />
                </StyledItemImage>
                <StyledItemAttrs>
                  <ItemRarityBadge rarity={item.rarity} />
                  <StyledItemName>
                    {item.collection && item.collection_name && (
                      <StyledItemCollectionBadge collection={item.collection} collectionName={item.collection_name} />
                    )}
                    {item.name}
                  </StyledItemName>
                  <StyledItemLevels>
                    {item.stats.map(stat => (
                      <StyledItemLevel key={stat.name}>
                        <StyledItemLevelLabel>{stat.name}</StyledItemLevelLabel>
                        <StyledItemLevelValue>{stat.value}</StyledItemLevelValue>
                      </StyledItemLevel>
                    ))}
                  </StyledItemLevels>
                </StyledItemAttrs>
              </StyledItemPreviewDetails>
              {ottos.length > 0 && (
                <StyledOttos>
                  {ottos.map(otto => (
                    <StyledOtto key={otto.id}>
                      <StyledOttoImage>
                        <CroppedImage src={otto.image} layout="fill" />
                      </StyledOttoImage>
                      <Note>{t('wearBy', { name: otto.name })}</Note>
                    </StyledOtto>
                  ))}
                </StyledOttos>
              )}
              {!equippedByCurrentOtto && (
                <StyledButton disabled={unavailable} Typography={Headline} onClick={() => onEquip(item.type, item.id)}>
                  {t(unavailable ? 'unavailable' : 'wear')}
                </StyledButton>
              )}
              {equippedByCurrentOtto && (
                <StyledButton
                  disabled={item.unreturnable}
                  primaryColor="white"
                  Typography={Headline}
                  onClick={() => onRemove(item.type)}
                >
                  {t(item.unreturnable ? 'unavailable' : 'takeOff')}
                </StyledButton>
              )}
            </>
          )}
        </StyledItemPreview>
      </CSSTransition>
    )
  },
  (a, b) => a.item?.id === b.item?.id
)
