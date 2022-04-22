import Layout from 'Layout'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import Item from 'models/Item'
import { ContentSmall } from 'styles/typography'
import { useEffect, useMemo, useState } from 'react'
import { useBreakPoints } from 'hooks/useMediaQuery'
import Fullscreen from 'components/Fullscreen'
import { gql, useQuery } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import axios from 'axios'
import PlaceholderImg from './tmp.png'
import ItemCell from './ItemCell'
import ItemDetails from './use-item/ItemDetails'
import UseItemPopup from './use-item/ItemPopup'
import { ListItems, ListItemsVariables } from './__generated__/ListItems'

const StyledMyItemsPage = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const StyledSectionTabContainer = styled.div`
  min-height: 90px;
  overflow: scroll;
`

const StyledSectionTabs = styled.div`
  display: flex;
  height: 100%;
  border-bottom: 4px solid ${({ theme }) => theme.colors.otterBlack};
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

const sections = ['All', 'Consumable', 'Holding', 'Headwear', 'Facial Accessories', 'Clothes', 'Background'] as const

type Section = typeof sections[number]

const SlotMapping: Record<number, string> = {
  0: 'Background',
  6: 'Facial Accessories',
  7: 'Headwear',
  8: 'Holding',
  255: 'Consumable',
}

const LIST_MY_ITEMS = gql`
  query ListItems($owner: Bytes!) {
    ottoItems(where: { rootOwner: $owner, amount_gt: 0 }) {
      id
      owner
      rootOwner
      slot
      tokenId
      tokenURI
      wearable
      amount
      parentTokenId
    }
  }
`

export default function MyItemsPage() {
  const { t } = useTranslation()
  const { account } = useEthers()
  const { isMobile } = useBreakPoints()
  const [selectedSection, setSelectedSection] = useState<Section>('All')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [useItem, setUseItem] = useState<Item | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const { data, loading } = useQuery<ListItems, ListItemsVariables>(LIST_MY_ITEMS, {
    variables: { owner: account || '' },
    skip: !account,
  })
  const displayItems = useMemo(
    () => (selectedSection === 'All' ? items : items.filter(i => i.type === selectedSection)),
    [items, selectedSection]
  )

  useEffect(() => {
    if (data) {
      Promise.all(
        data.ottoItems.map(rawItem =>
          axios
            .get(rawItem.tokenURI)
            .then(res => res.data)
            .then(({ name, image, details: { rarity, stats, base_rarity_score } }) => ({
              ...rawItem,
              id: rawItem.tokenId,
              name,
              type: SlotMapping[rawItem.slot] || 'Consumable',
              rarity,
              description: '',
              attrs: stats,
              image,
              equipped: Boolean(rawItem.parentTokenId),
              parentTokenId: rawItem.parentTokenId?.toString(),
              baseRarityScore: base_rarity_score,
            }))
        )
      ).then(items => setItems(items))
    }
  }, [data])

  return (
    <Layout title={t('my_items.title')} requireConnect>
      <StyledMyItemsPage>
        <StyledSectionTabContainer>
          <StyledSectionTabs>
            {sections.map((section, index) => (
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
          {isMobile ? (
            selectedItem && (
              <Fullscreen show background="white">
                <ItemDetails
                  item={selectedItem}
                  onClose={() => setSelectedItem(null)}
                  onUse={() => {
                    setUseItem(selectedItem)
                    setSelectedItem(null)
                  }}
                />
              </Fullscreen>
            )
          ) : (
            <StyledItemDetails>
              {selectedItem ? (
                <ItemDetails
                  item={selectedItem}
                  onClose={() => setSelectedItem(null)}
                  onUse={() => setUseItem(selectedItem)}
                />
              ) : (
                <StyledNoSelectedItem>
                  <ContentSmall>{t('my_items.no_selected_item')}</ContentSmall>
                </StyledNoSelectedItem>
              )}
            </StyledItemDetails>
          )}
        </StyledItemSection>
        {useItem && <UseItemPopup item={useItem} onClose={() => setUseItem(null)} />}
      </StyledMyItemsPage>
    </Layout>
  )
}
