import dynamic from 'next/dynamic'
import Dropdown from 'components/Dropdown'
import Fullscreen from 'components/Fullscreen'
import ItemCell from 'components/ItemCell'
import { LoadingView } from 'components/LoadingView'
import { useBreakpoints } from 'contexts/Breakpoints'
import useMyItems from 'hooks/useMyItems'
import Item from 'models/Item'
import { useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption, ContentSmall } from 'styles/typography'
import { FilterIcon, SortedIcon } from 'assets/icons'
import EmptyStatus from './empty.png'
import ItemDetails from './use-item/ItemDetails'

const RedeemCouponPopup = dynamic(() => import('./RedeemCouponPopup'), { ssr: false })
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

const sectionKeys = ['All', 'Holding', 'Headwear', 'Facial Accessories', 'Clothes', 'Background', 'Other'] as const

type SectionKey = typeof sectionKeys[number]

interface Section {
  isSection: (t: string) => boolean
}

const Sections: Record<SectionKey, Section> = {
  All: {
    isSection: (t: string) => true,
  },
  Holding: {
    isSection: (t: string) => t === 'Holding',
  },
  Headwear: {
    isSection: (t: string) => t === 'Headwear',
  },
  'Facial Accessories': {
    isSection: (t: string) => t === 'Facial Accessories',
  },
  Clothes: {
    isSection: (t: string) => t === 'Clothes',
  },
  Background: {
    isSection: (t: string) => t === 'Background',
  },
  Other: {
    isSection: (t: string) => t === 'Coupon' || t === 'Consumable',
  },
}

const SortedByOptions = ['time_received', 'rarity', 'str', 'dex', 'luck', 'cute', 'def', 'int', 'con']

const SortOrderOptions = ['desc', 'asc']

const Filters = ['none', 'not_equipped', 'equipped', 'otto_can_equip', 'lottie_can_equip']

export default function MyItemsPage() {
  const { t } = useTranslation('', { keyPrefix: 'my_items' })
  const { isMobile } = useBreakpoints()
  const [selectedSection, setSelectedSection] = useState<SectionKey>('All')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [usingItem, setUsingItem] = useState<Item | null>(null)
  const [redeemingCoupon, setRedeemingCoupon] = useState<Item | null>(null)
  const sortedByOptions = useMemo(() => SortedByOptions.map(key => ({ key, text: t(`sorted_by_options.${key}`) })), [t])
  const [sortedBy, setSortedBy] = useState(sortedByOptions[0])
  const sortOrderOptions = useMemo(
    () => SortOrderOptions.map(key => ({ key, text: t(`sort_order_options.${key}`) })),
    [t]
  )
  const [sortOrder, setSortOrder] = useState(sortOrderOptions[0])
  const filters = useMemo(() => Filters.map(key => ({ key, text: t(`filters.${key}`) })), [t])
  const [filter, setFilter] = useState(filters[0])
  const { items, loading, refetch } = useMyItems()
  const displayItems = useMemo(
    () =>
      items
        .filter(i => {
          let result = Sections[selectedSection].isSection(i.type)
          if (filter.key === 'not_equipped') {
            result = result && !i.equipped
          } else if (filter.key === 'equipped') {
            result = result && i.equipped
          } else if (filter.key === 'otto_can_equip') {
            result = result && (i.equippable_gender === 'Male' || i.equippable_gender === 'Both')
          } else if (filter.key === 'lottie_can_equip') {
            result = result && (i.equippable_gender === 'Female' || i.equippable_gender === 'Both')
          }
          return result
        })
        .sort((a, b) => {
          const multiplier = sortOrder.key === 'desc' ? 1 : -1
          if (sortedBy.key === 'time_received') {
            return (b.update_at - a.update_at) * multiplier
          }
          if (sortedBy.key === 'rarity') {
            return (b.total_rarity_score - a.total_rarity_score) * multiplier
          }
          if (sortedBy.key === 'luck') {
            return (b.luck - a.luck) * multiplier
          }
          if (sortedBy.key === 'dex') {
            return (b.dex - a.dex) * multiplier
          }
          if (sortedBy.key === 'cute') {
            return (b.cute - a.cute) * multiplier
          }
          if (sortedBy.key === 'def') {
            return (b.def - a.def) * multiplier
          }
          if (sortedBy.key === 'str') {
            return (b.str - a.str) * multiplier
          }
          if (sortedBy.key === 'int') {
            return (b.int - a.int) * multiplier
          }
          if (sortedBy.key === 'con') {
            return (b.con - a.con) * multiplier
          }
          return 0
        }),
    [items, selectedSection, sortedBy, sortOrder, filter]
  )
  const onUse = () => {
    if (selectedItem) {
      if (selectedItem.isCoupon) {
        setRedeemingCoupon(selectedItem)
      } else {
        setUsingItem(selectedItem)
      }
    }
    setSelectedItem(null)
  }
  return (
    <StyledMyItemsPage>
      <StyledSectionTabContainer>
        <StyledSectionTabs>
          {sectionKeys.map((section, index) => (
            <StyledSectionTab
              key={index}
              section={section}
              selected={selectedSection === section}
              onClick={() => setSelectedSection(section)}
            >
              <ContentSmall>{t(`section_title.${section}`)}</ContentSmall>
            </StyledSectionTab>
          ))}
        </StyledSectionTabs>
      </StyledSectionTabContainer>
      <StyledItemSection>
        <StyledLeftContainer>
          <StyledMenuBar>
            <StyledMenuItem>
              {isMobile ? <SortedIcon /> : <p>{t('sorted_by')}</p>}
              <Caption>
                <Dropdown
                  selected={sortedBy.text}
                  options={sortedByOptions.map(({ text }) => text)}
                  onSelect={text => setSortedBy(sortedByOptions.find(o => o.text === text) || sortedByOptions[0])}
                />
              </Caption>
              {isMobile ? '' : <p>{t('sort_order')}</p>}
              <Caption>
                <Dropdown
                  selected={sortOrder.text}
                  options={sortOrderOptions.map(({ text }) => text)}
                  onSelect={text => setSortOrder(sortOrderOptions.find(o => o.text === text) || sortOrderOptions[0])}
                />
              </Caption>
            </StyledMenuItem>
            <StyledMenuItem>
              {isMobile ? <FilterIcon /> : <p>{t('filter')}</p>}
              <Caption>
                <Dropdown
                  selected={filter.text}
                  options={filters.map(({ text }) => text)}
                  onSelect={text => setFilter(filters.find(o => o.text === text) || filters[0])}
                />
              </Caption>
            </StyledMenuItem>
          </StyledMenuBar>
          <StyledItemScrollContainer>
            {loading && <LoadingView />}
            {!loading && displayItems.length === 0 ? (
              <StyledEmptySlate>
                <img src={EmptyStatus.src} alt="Empty Status" />
                <p>{t('empty')}</p>
              </StyledEmptySlate>
            ) : (
              <StyledItemList>
                {displayItems.map((item, index) => (
                  <ItemCell
                    key={item.id + index}
                    item={item}
                    selected={item === selectedItem}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </StyledItemList>
            )}
          </StyledItemScrollContainer>
        </StyledLeftContainer>
        {isMobile ? (
          selectedItem && (
            <Fullscreen show background="white">
              <StyledMobileItemDetailsContainer>
                <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} onUse={onUse} />
              </StyledMobileItemDetailsContainer>
            </Fullscreen>
          )
        ) : (
          <StyledItemDetails>
            {selectedItem ? (
              <ItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} onUse={onUse} />
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
            setUsingItem(null)
          }}
        />
      )}
      {redeemingCoupon && (
        <RedeemCouponPopup
          coupon={redeemingCoupon}
          onClose={() => {
            refetch()
            setRedeemingCoupon(null)
          }}
        />
      )}
    </StyledMyItemsPage>
  )
}
