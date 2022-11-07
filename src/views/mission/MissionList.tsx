import styled from 'styled-components/macro'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import Switcher from 'components/Switcher'
import { Note } from 'styles/typography'
import { Mission } from 'models/Mission'
import { RawItemMetadata, rawItemMetadataToItemMetadata } from 'models/Item'
import MissionCard from './MissionCard'
import NewMissionPopup from './NewMissionPopup'

const item: RawItemMetadata = {
  name: 'Antlers',
  description:
    "These antlers come from the generation of Otters' grandparents, during the era in which the Otters and the Reindeers were sworn enemies. In the end, the Otters overthrew the Reindeers and established the Ottopia. The antlers are the spoils of war from that time. There might be some curses so beware of making them into medicinal wine (or anything).",
  image: 'https://api.otterclam.finance/assets/items/16515604/b61ee96931fb6e965d385912ee1d69b4.jpg',
  attributes: [
    {
      trait_type: 'Rarity',
      value: 'Common',
    },
    {
      trait_type: 'Collectible',
      value: 'Antlers',
    },
    {
      trait_type: 'STR',
      value: 0,
    },
    {
      trait_type: 'DEF',
      value: 0,
    },
    {
      trait_type: 'DEX',
      value: 0,
    },
    {
      trait_type: 'INT',
      value: 0,
    },
    {
      trait_type: 'LUK',
      value: 0,
    },
    {
      trait_type: 'CON',
      value: 0,
    },
    {
      trait_type: 'CUTE',
      value: 0,
    },
    {
      trait_type: 'BRS',
      value: 0,
    },
  ],
  id: '16515604',
  details: {
    id: '16515604',
    type: 'Collectible',
    name: 'Antlers',
    stats: [
      {
        name: 'STR',
        value: 'N/A',
      },
      {
        name: 'DEF',
        value: 'N/A',
      },
      {
        name: 'DEX',
        value: 'N/A',
      },
      {
        name: 'INT',
        value: 'N/A',
      },
      {
        name: 'LUK',
        value: 'N/A',
      },
      {
        name: 'CON',
        value: 'N/A',
      },
      {
        name: 'CUTE',
        value: 'N/A',
      },
    ],
    wearable: false,
    rarity: 'C2',
    base_rarity_score: 0,
    relative_rarity_score: 100,
    equipped_count: 0,
    equippable_gender: 'Both',
    labels: [],
    theme_boost: 0,
  },
}

const missions: Mission[] = [
  {
    id: 1,
    name: '恢復健康的藥水',
    description: '路卡斯的奶奶生病了，幫助他取得製作藥水的材料。',
    response: '奶奶又能多活幾年了！', // complete will show this
    level: 'A',
    status: 'ongoing',
    requirements: [
      {
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 2,
      },
    ],
    rewards: [
      {
        type: 'fish',
        decimal: 18,
        amount: '1000000000000000000',
      },
      {
        type: 'item',
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 1,
      },
    ],
  },
  {
    id: 1,
    name: '恢復健康的藥水',
    description: '路卡斯的奶奶生病了，幫助他取得製作藥水的材料。',
    response: '奶奶又能多活幾年了！', // complete will show this
    level: 'A',
    status: 'finished',
    requirements: [
      {
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 2,
      },
    ],
    rewards: [
      {
        type: 'fish',
        decimal: 18,
        amount: '1000000000000000000',
      },
      {
        type: 'item',
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 1,
      },
    ],
  },
  {
    id: 1,
    name: '恢復健康的藥水',
    description: '路卡斯的奶奶生病了，幫助他取得製作藥水的材料。',
    response: '奶奶又能多活幾年了！', // complete will show this
    level: 'A',
    status: 'ongoing',
    requirements: [
      {
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 2,
      },
    ],
    rewards: [
      {
        type: 'fish',
        decimal: 18,
        amount: '1000000000000000000',
      },
      {
        type: 'item',
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 1,
      },
    ],
  },
  {
    id: 1,
    name: '恢復健康的藥水',
    description: '路卡斯的奶奶生病了，幫助他取得製作藥水的材料。',
    response: '奶奶又能多活幾年了！', // complete will show this
    level: 'A',
    status: 'ongoing',
    requirements: [
      {
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 2,
      },
    ],
    rewards: [
      {
        type: 'fish',
        decimal: 18,
        amount: '1000000000000000000',
      },
      {
        type: 'item',
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 1,
      },
    ],
  },
  {
    id: 1,
    name: '恢復健康的藥水',
    description: '路卡斯的奶奶生病了，幫助他取得製作藥水的材料。',
    response: '奶奶又能多活幾年了！', // complete will show this
    level: 'A',
    status: 'ongoing',
    requirements: [
      {
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 2,
      },
    ],
    rewards: [
      {
        type: 'fish',
        decimal: 18,
        amount: '1000000000000000000',
      },
      {
        type: 'item',
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 1,
      },
    ],
  },
  {
    id: 1,
    name: '恢復健康的藥水',
    description: '路卡斯的奶奶生病了，幫助他取得製作藥水的材料。',
    response: '奶奶又能多活幾年了！', // complete will show this
    level: 'A',
    status: 'ongoing',
    requirements: [
      {
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 2,
      },
    ],
    rewards: [
      {
        type: 'fish',
        decimal: 18,
        amount: '1000000000000000000',
      },
      {
        type: 'item',
        item: {
          id: item.id,
          amount: 1,
          unreturnable: false,
          metadata: rawItemMetadataToItemMetadata(item),
          updatedAt: new Date(),
        },
        amount: 1,
      },
    ],
  },
]

const StyledMissionList = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.lightGray300};
  color: ${({ theme }) => theme.colors.otterBlack};
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

type MissionFilter = 'ongoing' | 'finished'

const filters: { label: string; value: MissionFilter }[] = [
  { label: 'ongoing', value: 'ongoing' },
  { label: 'finished', value: 'finished' },
]

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledSwitcher = styled(Switcher)``

export default function MissionList() {
  const { t } = useTranslation('', { keyPrefix: 'mission' })
  const [filter, setFilter] = useState<MissionFilter>('ongoing')
  const [mission, setMission] = useState<Mission | null>(null)
  return (
    <StyledMissionList>
      <StyledHeader>
        <StyledSwitcher name="filter" value={filter} options={filters} onChange={value => setFilter(value as any)} />
        <Note>{t('ongoingCap', { current: 4, max: 6 })}</Note>
      </StyledHeader>
      {missions.map(mission => (
        <MissionCard key={mission.id} mission={mission} onClick={() => setMission(mission)} />
      ))}
      {/* {mission && <NewMissionPopup mission={mission} />} */}
    </StyledMissionList>
  )
}
