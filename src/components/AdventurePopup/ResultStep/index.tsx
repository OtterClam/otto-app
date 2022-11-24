import Button from 'components/Button'
import PaymentButton from 'components/PaymentButton'
import { Token } from 'constant'
import {
  AdventurePopupStep,
  AdventureUIActionType,
  useAdventureUIState,
  useOpenAdventurePopup,
  useSelectedAdventureLocation,
} from 'contexts/AdventureUIState'
import { useApi } from 'contexts/Api'
import { useOtto } from 'contexts/Otto'
import { useAdventureRevive } from 'contracts/functions'
import { ethers } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { AdventurePreview } from 'models/AdventurePreview'
import { AdventureResult } from 'models/AdventureResult'
import { AdventureOttoStatus } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
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

export default function ResultStep() {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.resultStep' })
  const {
    state: { finishedTx },
  } = useAdventureUIState()
  const location = useSelectedAdventureLocation()
  const api = useApi()
  const [result, setResult] = useState<AdventureResult | null>(null)
  const { revive, reviveState, resetRevive } = useAdventureRevive()
  const { updateOtto } = useMyOttos()
  const { otto, setOtto } = useOtto()
  const { ADVENTURE } = useContractAddresses()
  const openPopup = useOpenAdventurePopup()
  const { dispatch } = useAdventureUIState()

  const closePopup = useCallback(() => {
    dispatch({ type: AdventureUIActionType.ClosePopup })
  }, [dispatch])

  const getAdventureResult = useCallback(() => {
    if (finishedTx) {
      api.getAdventureResult(finishedTx).then(data => setResult(data))
    }
  }, [api, finishedTx])

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
    if (otto && result && otto.latestAdventurePass?.id !== result?.pass.id) {
      otto.finish(result)
      setOtto(otto)
      updateOtto(otto)
    }
  }, [dispatch, finishedTx, otto, result, setOtto, updateOtto])

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
  }, [dispatch, otto, result])

  useEffect(() => {
    if (!(otto && result)) {
      return
    }
    const chests = result.events.treasureChests
    if (!chests) {
      return
    }
    dispatch({
      type: AdventureUIActionType.SetTreasuryChestItem,
      data: chests[0],
    })
  }, [dispatch, otto, result])

  if (!location) {
    return null
  }

  return (
    <StyledResultStep bg={location.bgImageBlack}>
      {result && otto && (
        <Head>
          <title>
            {t('og:title', {
              name: otto.name,
              result: t(result ? 'result_succeeded' : 'result_failed'),
              location: location.name,
            })}
          </title>
          <meta
            property="description"
            content={t('og:description', {
              name: otto.name,
              location: location.name,
            })}
          />
          <meta
            property="og:title"
            content={t('og:title', {
              name: otto.name,
              result: t(result ? 'result_succeeded' : 'result_failed'),
              location: location.name,
            })}
          />
          <meta
            property="og:description"
            content={t('og:description', {
              name: otto.name,
              location: location.name,
            })}
          />
          <meta property="og:image" content={result.image} />
        </Head>
      )}
      <StyledBody>
        <StyledJournalSection result={result} />
        {result && otto && <StyledRewardSection result={result} otto={otto} />}
        {result && (
          <StyledButtons>
            {result.success && (
              <Button
                Typography={Headline}
                onClick={() => {
                  closePopup()
                  openPopup(
                    undefined,
                    otto?.adventureStatus === AdventureOttoStatus.Resting
                      ? AdventurePopupStep.Resting
                      : AdventurePopupStep.Map
                  )
                }}
              >
                {t('explore_again_btn')}
              </Button>
            )}
            {!(result.success || result.revived) && (
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
            )}
            <Button Typography={Headline} primaryColor="white" onClick={closePopup}>
              {t('close_btn')}
            </Button>
          </StyledButtons>
        )}
      </StyledBody>
    </StyledResultStep>
  )
}
