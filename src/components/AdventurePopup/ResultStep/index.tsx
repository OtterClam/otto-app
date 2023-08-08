import AdventureResultSharePopup from 'components/AdventureResultSharePopup'
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
import { useReviveInfo } from 'contracts/views'
import { ethers } from 'ethers'
import { useTokenInfo } from 'hooks/token-info'
import useContractAddresses from 'hooks/useContractAddresses'
import { AdventureResult } from 'models/AdventureResult'
import Otto, { AdventureOttoStatus } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { Headline, Note } from 'styles/typography'
import JournalSection from './JournalSection'
import RewardSection from './RewardSection'

const ShareImage = {
  src: '/images/adventure/share.png',
  width: 40,
  height: 40,
}

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

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`

const StyledShareButtonText = styled.span`
  display: flex;
  align-items: center;
  gap 4px;

  &::before {
    content: '';
    display: inline-block;
    background: center / cover url(${ShareImage.src});
    width: ${ShareImage.width / 2}px;
    height: ${ShareImage.height / 2}px;
  }
`

const StyledRevivingBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 480px;
  margin: 0 auto;
`

const StyledRevivingText = styled(Note).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
  letter-spacing: 0em;
  text-align: center;
`

export default function ResultStep() {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.resultStep' })
  const {
    state: { finishedTx, showEvent },
  } = useAdventureUIState()
  const router = useRouter()
  const location = useSelectedAdventureLocation()
  const api = useApi()
  const [sharedOtto, setSharedOtto] = useState<Otto | null>(null)
  const { ottos: ottosRepo } = useRepositories()
  const [result, setResult] = useState<AdventureResult | null>(null)
  const { price } = useReviveInfo()
  const { revive, reviveState, resetRevive } = useAdventureRevive()
  const { updateOtto } = useMyOttos()
  const { otto, setOtto } = useOtto()
  const { ADVENTURE } = useContractAddresses()
  const openPopup = useOpenAdventurePopup()
  const { dispatch } = useAdventureUIState()
  const { MATIC } = useTokenInfo()

  const displayedOtto = otto || sharedOtto
  const reviving = reviveState.status === 'Mining'

  const closePopup = useCallback(() => {
    dispatch({ type: AdventureUIActionType.ClosePopup })
  }, [dispatch])

  const getAdventureResult = useCallback(() => {
    if (finishedTx) {
      api.getAdventureResult(finishedTx).then(data => setResult(data))
    }
  }, [api, finishedTx])

  const share = useCallback(() => {
    dispatch({ type: AdventureUIActionType.OpenSharePopup })
  }, [dispatch])

  useEffect(() => {
    if (router.query.otto) {
      const ottoId = String(router.query.otto)
      ottosRepo
        .getOtto(ottoId)
        .then(setSharedOtto)
        .catch(err => {
          console.error('failed to getOtto', err.message)
        })
    }
  }, [ottosRepo, router.query.otto])

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
    if (!(otto && result?.events && result.events.level_up && showEvent)) {
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
  }, [dispatch, otto, result, showEvent])

  useEffect(() => {
    if (!(otto && result && showEvent)) {
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
  }, [dispatch, otto, result, showEvent])

  if (!location) {
    return null
  }

  const exploreAgainButton = otto?.adventureStatus === AdventureOttoStatus.Ready && (
    <Button
      Typography={Headline}
      onClick={() => {
        otto.playVoice()
        setOtto(otto, true)
        closePopup()
        openPopup(location.id, AdventurePopupStep.PreviewOtto)
      }}
    >
      {t('explore_again_btn')}
    </Button>
  )

  return (
    <StyledResultStep bg={location.bgImageBlack}>
      {result && displayedOtto && (
        <Head>
          <title>
            {t('og_title', {
              name: displayedOtto.name,
              result: t(result ? 'og_succeeded' : 'og_failed'),
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
              result: t(result ? 'og_succeeded' : 'og_failed'),
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
      {reviveState.status === 'Mining' && (
        <StyledRevivingBody>
          <Image width={300} height={300} src="/images/adventure/kodama-revive.gif" />
          <StyledRevivingText>{t('reviving_desc')}</StyledRevivingText>
        </StyledRevivingBody>
      )}
      {reviveState.status !== 'Mining' && (
        <StyledBody>
          <StyledJournalSection result={result} />
          {result && displayedOtto && <StyledRewardSection result={result} otto={displayedOtto} />}
          {result && (
            <StyledButtons>
              {otto && !result.success && !result.revived && (
                <>
                  <PaymentButton
                    Typography={Headline}
                    loading={reviveState.status === 'PendingSignature'}
                    spenderAddress={ADVENTURE}
                    token={MATIC}
                    amount={price || '0'}
                    onClick={() => otto && revive(otto.id, { value: price || '0', gasLimit: 2000000 })}
                  >
                    {t('revive_btn')}
                  </PaymentButton>
                  {exploreAgainButton}
                </>
              )}
              {otto && (result.success || result.revived) && exploreAgainButton}
              <StyledButtonGroup>
                <Button width="50%" Typography={Headline} primaryColor="white" onClick={share}>
                  <StyledShareButtonText>{t('share_btn')}</StyledShareButtonText>
                </Button>
                <Button width="50%" Typography={Headline} primaryColor="white" onClick={closePopup}>
                  {t('close_btn')}
                </Button>
              </StyledButtonGroup>
            </StyledButtons>
          )}
        </StyledBody>
      )}
      {result && displayedOtto && router.query.location && router.query.adventure_tx && (
        <AdventureResultSharePopup
          result={result}
          ottoId={displayedOtto.id}
          tx={router.query.adventure_tx as string}
          locationId={router.query.location as string}
        />
      )}
    </StyledResultStep>
  )
}
