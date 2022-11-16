import TabButton from 'components/TabButton'
import Otto from 'models/Otto'
import { useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentSmall } from 'styles/typography'
import ItemCard from './TraitCard'

const StyledTraitDetails = styled.div``

const StyledTraitCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledTab = styled.section`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`

const StyledRarityScoreSum = styled(ContentSmall).attrs({ as: 'p' })`
  margin-bottom: 20px;
`

interface Props {
  otto: Otto
}

type Tab = 'genetic' | 'wearable'

export default function OttoTraitDetails({ otto }: Props) {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState<Tab>('genetic')
  const itemsMetadata = selectedTab === 'genetic' ? otto.geneticItemsMetadata : otto.wearableItemsMetadata
  const [score, brs, rrs] = useMemo(() => {
    let score = 0
    let brs = 0
    let rrs = 0
    itemsMetadata.forEach(metadata => {
      score += metadata.totalRarityScore
      brs += metadata.baseRarityScore
      rrs += metadata.relativeRarityScore
    })
    return [score, brs, rrs]
  }, [itemsMetadata])

  return (
    <StyledTraitDetails>
      <StyledTab>
        <TabButton selected={selectedTab === 'genetic'} onClick={() => setSelectedTab('genetic')}>
          <ContentSmall>{t('otto.genetic_traits_tab')}</ContentSmall>
        </TabButton>
        <TabButton selected={selectedTab === 'wearable'} onClick={() => setSelectedTab('wearable')}>
          <ContentSmall>{t('otto.wearable_traits_tab')}</ContentSmall>
        </TabButton>
      </StyledTab>
      <StyledRarityScoreSum>{t('otto.total_rarity_score', { score, brs, rrs })}</StyledRarityScoreSum>
      <StyledTraitCards>
        {itemsMetadata.map((metadata, index) => (
          <ItemCard key={index} metadata={metadata} />
        ))}
      </StyledTraitCards>
    </StyledTraitDetails>
  )
}
