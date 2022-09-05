import Button from 'components/Button'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentLarge } from 'styles/typography'
import JournalSection from './JournalSection'
import RewardSection from './RewardSection'

const StyledResultStep = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 20px;
`

const StyledJournalSection = styled(JournalSection)`
  margin-top: 50px;
`

const StyledRewardSection = styled(RewardSection)``

const StyledButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
`

interface Props {
  otto: Otto
}

export default function ResultStep({ otto }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.resultStep' })
  const succeeded = false
  return (
    <StyledResultStep>
      <StyledJournalSection succeeded={succeeded} />
      <StyledRewardSection succeeded={succeeded} />
      <StyledButtons>
        <Button Typography={ContentLarge}>{t('explore_again_btn')}</Button>
        <Button Typography={ContentLarge} primaryColor="white">
          {t('switch_place_btn')}
        </Button>
      </StyledButtons>
    </StyledResultStep>
  )
}
