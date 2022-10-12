import Button from 'components/Button'
import PaymentButton from 'components/PaymentButton'
import { Token } from 'constant'
import { AdventureUIActionType, useAdventureUIState, useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useApi } from 'contexts/Api'
import { useOtto } from 'contexts/Otto'
import { useAdventureRevive } from 'contracts/functions'
import { ethers } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { AdventureResult } from 'models/AdventureLocation'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useState } from 'react'
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

interface Props {
  tx: string
}

export default function FinishedView({ tx }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.resultStep' })
  const location = useSelectedAdventureLocation()!
  const api = useApi()
  const [result, setResult] = useState<AdventureResult | null>(null)
  const { revive, reviveState, resetRevive } = useAdventureRevive()
  const { otto } = useOtto()
  const { ADVENTURE } = useContractAddresses()
  const { dispatch } = useAdventureUIState()

  const closePopup = useCallback(() => {
    dispatch({ type: AdventureUIActionType.ClosePopup })
  }, [dispatch])

  const getAdventureResult = useCallback(() => api.getAdventureResult(tx).then(data => setResult(data)), [api, tx])

  useEffect(() => {
    getAdventureResult()
  }, [getAdventureResult])

  useEffect(() => {
    if (reviveState.status === 'Success') {
      getAdventureResult()
    }
    if (reviveState.status === 'Exception' || reviveState.status === 'Fail') {
      alert(reviveState.errorMessage)
      resetRevive()
    }
  }, [getAdventureResult, reviveState, resetRevive])

  useEffect(() => {
    if (!(otto && result?.events && result.events.level_up)) {
      return
    }
    dispatch({
      type: AdventureUIActionType.LevelUp,
      data: {
        ottoId: otto.id,
        levelUp: result.events.level_up,
        rewards: result.rewards,
      },
    })
  }, [result])

  return (
    <StyledResultStep bg={location.bgImageBlack}>
      <StyledBody>
        {result && <StyledJournalSection result={result} />}
        {result && <StyledRewardSection result={result} />}
        {(result?.success || result?.revived) && (
          <StyledButtons>
            <Button Typography={Headline}>{t('explore_again_btn')}</Button>
            <Button Typography={Headline} primaryColor="white" onClick={closePopup}>
              {t('close_btn')}
            </Button>
          </StyledButtons>
        )}
        {!(result?.success || result?.revived) && (
          <StyledButtons>
            <PaymentButton
              Typography={Headline}
              loading={reviveState.status === 'PendingSignature' || reviveState.status === 'Mining'}
              spenderAddress={ADVENTURE}
              token={Token.Clam}
              amount={ethers.utils.parseUnits('1', 9)}
              onClick={() => otto && revive(otto.id)}
            >
              {t('revive_btn')}
            </PaymentButton>
            <Button Typography={Headline} primaryColor="white" onClick={closePopup}>
              {t('close_btn')}
            </Button>
          </StyledButtons>
        )}
      </StyledBody>
    </StyledResultStep>
  )
}
