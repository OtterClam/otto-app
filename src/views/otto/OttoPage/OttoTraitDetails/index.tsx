import TabButton from 'components/TabButton'
import Otto from 'models/Otto'
import { useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentSmall } from 'styles/typography'
import TraitCard from './TraitCard'

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
  const traits = selectedTab === 'genetic' ? otto.geneticTraits : otto.wearableTraits
  const [score, brs, rrs] = useMemo(() => {
    let score = 0
    let brs = 0
    let rrs = 0
    traits.forEach(trait => {
      score += trait.total_rarity_score
      brs += trait.base_rarity_score
      rrs += trait.relative_rarity_score
    })
    return [score, brs, rrs]
  }, [traits])
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
        {traits.map((trait, index) => (
          <TraitCard key={index} trait={trait} />
        ))}
      </StyledTraitCards>
    </StyledTraitDetails>
  )
}
