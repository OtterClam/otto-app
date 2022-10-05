import Button from 'components/Button'
import { useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Headline } from 'styles/typography'
import JournalSection from './JournalSection'
import RewardSection from './RewardSection'

const StyledResultStep = styled.div<{ bg: string }>`
  background: center / cover url(${({ bg }) => bg});
  padding: 20px;
`

const StyledBody = styled.div`
  max-width: 480px;
  margin: 0 auto;
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

export default function FinishedView() {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.resultStep' })
  const succeeded = false
  const location = useSelectedAdventureLocation()!

  return (
    <StyledResultStep bg={location.bgImageBlack}>
      <StyledBody>
        <StyledJournalSection succeeded={succeeded} />
        <StyledRewardSection succeeded={succeeded} />
        <StyledButtons>
          <Button Typography={Headline}>{t('explore_again_btn')}</Button>
          <Button Typography={Headline} primaryColor="white">
            {t('switch_place_btn')}
          </Button>
        </StyledButtons>
      </StyledBody>
    </StyledResultStep>
  )
}
