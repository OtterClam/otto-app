import Fullscreen from 'components/Fullscreen'
import ItemCell from 'components/ItemCell'
import { useBreakPoints } from 'hooks/useMediaQuery'
import useMyItems from 'hooks/useMyItems'
import Layout from 'Layout'
import Item from 'models/Item'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentSmall } from 'styles/typography'
import RedeemCouponPopup from './RedeemCouponPopup'
import ItemDetails from './use-item/ItemDetails'
import UseItemPopup from './use-item/ItemPopup'

const StyledMyItemsPage = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const StyledSectionTabContainer = styled.div`
  min-height: 90px;
  overflow: scroll;
  border-bottom: 4px solid ${({ theme }) => theme.colors.otterBlack};
`

const StyledSectionTabs = styled.div`
  display: flex;
  height: 100%;
`

const StyledSectionTab = styled.button<{ section: string; selected: boolean }>`
  display: flex;
  height: 100%;
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
  overflow-y: scroll;
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

export default function MyItemsPage() {
  const { t } = useTranslation()
  const { isMobile } = useBreakPoints()
  const [selectedSection, setSelectedSection] = useState<SectionKey>('All')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [usingItem, setUsingItem] = useState<Item | null>(null)
  const [redeemingCoupon, setRedeemingCoupon] = useState<Item | null>(null)
  const { items, refetch } = useMyItems()
  const displayItems = useMemo(
    () => items.filter(i => Sections[selectedSection].isSection(i.type)),
    [items, selectedSection]
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
    <Layout title={t('my_items.title')} requireConnect>
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
                <ContentSmall>{t(`my_items.section_title.${section}`)}</ContentSmall>
              </StyledSectionTab>
            ))}
          </StyledSectionTabs>
        </StyledSectionTabContainer>
        <StyledItemSection>
          <StyledItemScrollContainer>
            <StyledItemList>
              {displayItems.map((item, index) => (
                <ItemCell
                  key={index}
                  item={item}
                  selected={item === selectedItem}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </StyledItemList>
          </StyledItemScrollContainer>
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
                  <ContentSmall>{t('my_items.no_selected_item')}</ContentSmall>
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
        {redeemingCoupon && <RedeemCouponPopup coupon={redeemingCoupon} onClose={() => setRedeemingCoupon(null)} />}
      </StyledMyItemsPage>
    </Layout>
  )
}
