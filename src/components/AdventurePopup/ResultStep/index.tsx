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
import { useRepositories } from 'contexts/Repositories'
import { useAdventureRevive } from 'contracts/functions'
import { ethers } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { AdventureResult } from 'models/AdventureResult'
import Otto, { AdventureOttoStatus } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const router = useRouter()
  const location = useSelectedAdventureLocation()
  const api = useApi()
  const [sharedOtto, setSharedOtto] = useState<Otto | null>(null)
  const { ottos: ottosRepo } = useRepositories()
  const [result, setResult] = useState<AdventureResult | null>(null)
  const { revive, reviveState, resetRevive } = useAdventureRevive()
  const { updateOtto } = useMyOttos()
  const { otto, setOtto } = useOtto()
  const { ADVENTURE } = useContractAddresses()
  const openPopup = useOpenAdventurePopup()
  const { dispatch } = useAdventureUIState()

  const displayedOtto = otto || sharedOtto

  const closePopup = useCallback(() => {
    dispatch({ type: AdventureUIActionType.ClosePopup })
  }, [dispatch])

  const getAdventureResult = useCallback(() => {
    if (finishedTx) {
      api.getAdventureResult(finishedTx).then(data => setResult(data))
    }
  }, [api, finishedTx])

  useEffect(() => {
    if (router.query.otto) {
      const ottoId = String(router.query.otto)
      ottosRepo
        .getOtto(ottoId)
        .then(setSharedOtto)
        .catch(err => {
          alert(err.message)
        })
    }
  }, [ottosRepo])

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
      {result && displayedOtto && (
        <Head>
          <title>
            {t('og_title', {
              name: displayedOtto.name,
              result: t(result ? 'result_succeeded' : 'result_failed'),
              location: location.name,
            })}
          </title>
          <meta
            property="description"
            content={t('og_description', {
              name: displayedOtto.name,
              location: location.name,
            })}
          />
          <meta
            property="og:title"
            content={t('og_title', {
              name: displayedOtto.name,
              result: t(result ? 'result_succeeded' : 'result_failed'),
              location: location.name,
            })}
          />
          <meta
            property="og:description"
            content={t('og_description', {
              name: displayedOtto.name,
              location: location.name,
            })}
          />
          <meta property="og:image" content={result.image} />
        </Head>
      )}
      <StyledBody>
        <StyledJournalSection result={result} />
        {result && displayedOtto && <StyledRewardSection result={result} otto={displayedOtto} />}
        {result && (
          <StyledButtons>
            {otto && result.success && (
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
            {otto && !(result.success || result.revived) && (
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
