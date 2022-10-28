import dynamic from 'next/dynamic'
import Dropdown from 'components/Dropdown'
import Fullscreen from 'components/Fullscreen'
import ItemCell from 'components/ItemCell'
import { LoadingView } from 'components/LoadingView'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import { FilterIcon, SortedIcon } from 'assets/icons'
// FIX:
import { ItemType as NewItemType } from 'models/Item'
import { ItemFiltersProvider, ItemType, useItemFilters } from 'contexts/ItemFilters'
import { FilterSelector, OrderSelector, SortedBySelector } from 'components/ItemFilterSelect'
import Button from 'components/Button'
import { useMyItem, useMyItems } from 'contexts/MyItems'
import EmptyStatus from './empty.png'
import ItemDetails from './use-item/ItemDetails'

const RedeemCouponPopup = dynamic(() => import('../../components/RedeemCouponPopup'), { ssr: false })
const UseItemPopup = dynamic(() => import('./use-item/ItemPopup'), { ssr: false })

const StyledMyItemsPage = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const StyledSectionTabContainer = styled.div`
  display: flex;
  align-items: stretch;
  overflow: scroll;
  border-bottom: 4px solid ${({ theme }) => theme.colors.otterBlack};
`

const StyledSectionTabs = styled.div`
  display: flex;
  height: 100%;
  align-items: stretch;
`

const StyledSectionTab = styled.button<{ section: string; selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  min-width: 120px;
  background-color: ${({ theme, selected }) => (selected ? theme.colors.crownYellow : 'transparent')};
  border-left: 4px solid ${({ theme, selected }) => (selected ? theme.colors.otterBlack : 'transparent')};
  border-right: 4px solid ${({ theme, selected }) => (selected ? theme.colors.otterBlack : 'transparent')};
  transform: translateX(-4px);

  &::before {
    content: '';
    display: inline-block;
    width: 44px;
    height: 44px;
    background-size: 44px 44px;
    background-image: url(/trait-icons/${({ section }) => encodeURI(section)}.png);
    margin-right: 5px;
  }
`

const StyledItemSection = styled.div`
  display: flex;
  height: 100%;
  min-height: 0;
`

const StyledLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`

const StyledMenuBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 30px;
`

const StyledMenuItem = styled(ContentSmall).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  gap: 5px;
`

const StyledItemScrollContainer = styled.div`
  overflow-y: auto;
  flex: 1;
  padding-top: 2px;
`

const StyledItemList = styled.div`
  display: flex;
  height: fit-content;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  padding: 26px;
  padding-top: 0;
`

const StyledItemDetails = styled.section`
  overflow: hidden scroll;
  width: 380px;
  border-left: 4px solid ${({ theme }) => theme.colors.otterBlack};
`

const StyledNoSelectedItem = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.darkGray100};
`

const StyledMobileItemDetailsContainer = styled.div`
  height: 90vh;
  overflow-y: auto;
`

const StyledEmptySlate = styled(ContentSmall).attrs({ as: 'div' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  img {
    width: 220px;
    height: 192px;
  }
`

const StyledItemListContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledItemsPagination = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 26px 26px 26px;
`

function ItemList({
  loading,
  selectedItemId,
  selectItemId,
}: {
  loading?: boolean
  selectedItemId?: string
  selectItemId: (itemId?: string) => void
}) {
  const { t } = useTranslation('', { keyPrefix: 'my_items' })
  const { filteredItems: items, hasNextPage, hasPrevPage, nextPage, prevPage } = useItemFilters()

  return (
    <StyledItemListContainer>
      <StyledItemScrollContainer>
        {loading && <LoadingView />}
        {!loading && items.length === 0 ? (
          <StyledEmptySlate>
            <img src={EmptyStatus.src} alt="Empty Status" />
            <p>{t('empty')}</p>
          </StyledEmptySlate>
        ) : (
          <StyledItemList>
            {items.map(item => (
              <ItemCell
                key={item.id}
                item={item}
                selected={item.id === selectedItemId}
                onClick={() => selectItemId(item.id)}
              />
            ))}
          </StyledItemList>
        )}
      </StyledItemScrollContainer>
      {(hasPrevPage || hasNextPage) && (
        <StyledItemsPagination>
          {hasPrevPage ? (
            <Button Typography={Headline} primaryColor="white" onClick={prevPage}>
              {t('prev_page')}
            </Button>
          ) : (
            <div />
          )}
          {hasNextPage ? (
            <Button Typography={Headline} primaryColor="white" onClick={nextPage}>
              {t('next_page')}
            </Button>
          ) : (
            <div />
          )}
        </StyledItemsPagination>
      )}
    </StyledItemListContainer>
  )
}

function SectionTabs() {
  const { t } = useTranslation('', { keyPrefix: 'my_items' })
  const { itemType, setItemType } = useItemFilters()

  return (
    <StyledSectionTabContainer>
      <StyledSectionTabs>
        {Object.values(ItemType).map((type, index) => (
          <StyledSectionTab key={index} section={type} selected={itemType === type} onClick={() => setItemType(type)}>
            <ContentSmall>{t(`section_title.${type}`)}</ContentSmall>
          </StyledSectionTab>
        ))}
      </StyledSectionTabs>
    </StyledSectionTabContainer>
  )
}

export default function MyItemsPage() {
  const { t } = useTranslation('', { keyPrefix: 'my_items' })
  const { isMobile } = useBreakpoints()
  const [selectedItemId, setSelectedItemId] = useState<string>()
  const [usingItemId, setUsingItemId] = useState<string>()
  const [redeemingCouponId, setRedeemingCouponId] = useState<string>()
  const { items, loading, refetch } = useMyItems()
  const selectedItem = useMyItem(selectedItemId)
  const usingItem = useMyItem(usingItemId)
  const redeemingCoupon = useMyItem(redeemingCouponId)

  const onUse = useCallback(() => {
    if (selectedItem) {
      if (selectedItem.metadata.type === NewItemType.Coupon) {
        setRedeemingCouponId(selectedItemId)
      } else {
        setUsingItemId(selectedItemId)
      }
    }
    setSelectedItemId(undefined)
  }, [selectedItem])

  return (
    <StyledMyItemsPage>
      <ItemFiltersProvider items={items} itemsPerPage={36}>
        <SectionTabs />
        <StyledItemSection>
          <StyledLeftContainer>
            <StyledMenuBar>
              <StyledMenuItem>
                {isMobile ? <SortedIcon /> : <p>{t('sorted_by')}</p>}
                <SortedBySelector />
                {isMobile ? '' : <p>{t('sort_order')}</p>}
                <OrderSelector />
              </StyledMenuItem>
              <StyledMenuItem>
                {isMobile ? <FilterIcon /> : <p>{t('filter')}</p>}
                <FilterSelector />
              </StyledMenuItem>
            </StyledMenuBar>
            <ItemList loading={loading} selectItemId={setSelectedItemId} selectedItemId={selectedItemId} />
          </StyledLeftContainer>
          {isMobile ? (
            selectedItem && (
              <Fullscreen show background="white">
                <StyledMobileItemDetailsContainer>
                  <ItemDetails item={selectedItem} onClose={() => setSelectedItemId(undefined)} onUse={onUse} />
                </StyledMobileItemDetailsContainer>
              </Fullscreen>
            )
          ) : (
            <StyledItemDetails>
              {selectedItem ? (
                <ItemDetails item={selectedItem} onClose={() => setSelectedItemId(undefined)} onUse={onUse} />
              ) : (
                <StyledNoSelectedItem>
                  <ContentSmall>{t('no_selected_item')}</ContentSmall>
                </StyledNoSelectedItem>
              )}
            </StyledItemDetails>
          )}
        </StyledItemSection>
        {usingItem && (
          <UseItemPopup
            item={usingItem}
            onClose={() => {
              refetch()
              setUsingItemId(undefined)
            }}
          />
        )}
        {redeemingCoupon && (
          <RedeemCouponPopup
            coupon={redeemingCoupon.metadata}
            onClose={() => {
              refetch()
              setRedeemingCouponId(undefined)
            }}
          />
        )}
      </ItemFiltersProvider>
    </StyledMyItemsPage>
  )
}
