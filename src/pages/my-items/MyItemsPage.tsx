import Layout from 'Layout'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import Item from 'models/Item'
import { ContentSmall } from 'styles/typography'
import { useMemo, useState } from 'react'
import { useBreakPoints } from 'hooks/useMediaQuery'
import Fullscreen from 'components/Fullscreen'
import PlaceholderImg from './tmp.png'
import ItemCell from './ItemCell'
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

const items: Item[] = [
  {
    id: '123',
    image: PlaceholderImg,
    name: 'Vaccine',
    type: 'Consumable',
    rarity: 'R3',
    wearable: true,
    description:
      'Only the Otto with genetic face masks can take Potion BB. After being taken, the face mask will be taken off and return to your item inventory.\n\n There’s a 10% chance that the Otto will have a side effect: INT-1.',
    attrs: [{ type: 'STR', value: '1' }],
  },
  {
    id: '123',
    image: PlaceholderImg,
    name: 'Vaccine',
    type: 'Consumable',
    rarity: 'R3',
    wearable: false,
    description:
      'Only the Otto with genetic face masks can take Potion BB. After being taken, the face mask will be taken off and return to your item inventory.\n\n There’s a 10% chance that the Otto will have a side effect: INT-1.',

    attrs: [{ type: 'STR', value: '1' }],
  },
  {
    id: '123',
    image: PlaceholderImg,
    name: 'Vaccine',
    type: 'Consumable',
    rarity: 'R2',
    wearable: false,
    description:
      'Only the Otto with genetic face masks can take Potion BB. After being taken, the face mask will be taken off and return to your item inventory.\n\n There’s a 10% chance that the Otto will have a side effect: INT-1.',
    attrs: [{ type: 'STR', value: '1' }],
  },
  {
    id: '123',
    image: PlaceholderImg,
    name: 'Vaccine',
    type: 'Consumable',
    rarity: 'E1',
    wearable: false,
    description:
      'Only the Otto with genetic face masks can take Potion BB. After being taken, the face mask will be taken off and return to your item inventory.\n\n There’s a 10% chance that the Otto will have a side effect: INT-1.',
    attrs: [{ type: 'STR', value: '1' }],
  },
  {
    id: '123',
    image: PlaceholderImg,
    name: 'Vaccine',
    type: 'Headwear',
    rarity: 'R1',
    wearable: false,
    description:
      'Only the Otto with genetic face masks can take Potion BB. After being taken, the face mask will be taken off and return to your item inventory.\n\n There’s a 10% chance that the Otto will have a side effect: INT-1.',
    attrs: [{ type: 'STR', value: '1' }],
  },
  {
    id: '123',
    image: PlaceholderImg,
    name: 'Vaccine',
    type: 'Holding',
    rarity: 'C3',
    wearable: false,
    description:
      'Only the Otto with genetic face masks can take Potion BB. After being taken, the face mask will be taken off and return to your item inventory.\n\n There’s a 10% chance that the Otto will have a side effect: INT-1.',
    attrs: [{ type: 'STR', value: '1' }],
  },
  {
    id: '123',
    image: PlaceholderImg,
    name: 'Vaccine',
    type: 'Consumable',
    rarity: 'R3',
    wearable: false,
    description:
      'Only the Otto with genetic face masks can take Potion BB. After being taken, the face mask will be taken off and return to your item inventory.\n\n There’s a 10% chance that the Otto will have a side effect: INT-1.',
    attrs: [{ type: 'STR', value: '1' }],
  },
]

export default function MyItemsPage() {
  const { t } = useTranslation()
  const { isMobile } = useBreakPoints()
  const [selectedSection, setSelectedSection] = useState<Section>('All')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [useItem, setUseItem] = useState<Item | null>(null)

  const displayItems = useMemo(
    () => (selectedSection === 'All' ? items : items.filter(i => i.type === selectedSection)),
    [items, selectedSection]
  )

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
                amount={3}
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
