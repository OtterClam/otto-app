import Button from 'components/Button'
import { useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useApi } from 'contexts/Api'
import { AdventureResult } from 'models/AdventureLocation'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
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
  const location = useSelectedAdventureLocation()!
  const api = useApi()
  const [result, setResult] = useState<AdventureResult | null>(null)

  // TODO: use true value
  useEffect(() => {
    api
      .getAdventureResult('0xa7581518772e7f308fbe55247a5428c5bea59aa18a267bf8657d4750d32db18d')
      .then(data => setResult(data))
  }, [api])

  return (
    <StyledResultStep bg={location.bgImageBlack}>
      <StyledBody>
        {result && <StyledJournalSection result={result} />}
        {result && <StyledRewardSection result={result} />}
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
