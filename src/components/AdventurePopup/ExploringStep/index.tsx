import TimeIcon from 'assets/icons/icon_time.svg'
import AdventureLocationName from 'components/AdventureLocationName'
import Button from 'components/Button'
import PaymentButton from 'components/PaymentButton'
import { useGoToAdventureResultStep, useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import { useAdventureFinish, useUsePotions } from 'contracts/functions'
import { useFinishFee } from 'contracts/views'
import formatDistance from 'date-fns/formatDistance'
import { useTokenInfo } from 'hooks/token-info'
import useContractAddresses from 'hooks/useContractAddresses'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ContentLarge, ContentMedium, Note } from 'styles/typography'
import { calcRemainingTime } from 'utils/potion'
import SpeedUpPotions from '../SpeedUpPotions'

const jump = keyframes`
  0% {
    transform: translate(0, -10px);
  }
  12.5% {
    transform: translate(-20px, 10px);
  }
  25% {
    transform: translate(-30px, 0);
  }
  37.5% {
    transform: translate(-20px, 10px);
  }
  50% {
    transform: translate(0, -10px);
  }
  62.5% {
    transform: translate(20px, 10px);
  }
  75% {
    transform: translate(30px, 0);
  }
  87.5% {
    transform: translate(20px, 10px);
  }
  100% {
    transform: translate(0, -10px);
  }
`

const StyledExploringStep = styled.div<{ bg: string }>`
  padding: 40px;
  color: ${({ theme }) => theme.colors.white};
  background: center / cover url(${({ bg }) => bg});
`

const StyledContent = styled.div`
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
`

const StyledTitle = styled(ContentLarge).attrs({ as: 'h1' })`
  text-align: center;
`

const StyledOttoPlace = styled.div<{ bg: string }>`
  position: relative;
  width: 100%;
  height: 220px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  overflow: hidden;
  background: center / cover url(${({ bg }) => bg});
`

const StyledOtto = styled.img`
  position: absolute;
  left: calc(50% - 60px);
  bottom: 0;
  width: 120px;
  height: 120px;
  animation: ${jump} 2s linear infinite;
`

const StyledDuration = styled(ContentMedium).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  position: absolute;
  top: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.otterBlack};
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 0 0 0 10px;
`

const StyledHint = styled(Note).attrs({ as: 'p' })`
  a {
    color: ${({ theme }) => theme.colors.crownYellow};
  }
`

const StyledSeeResultHint = styled(Note).attrs({ as: 'p' })`
  text-align: center;
`

const StyledName = styled(AdventureLocationName)`
  position: absolute;
  top: 0;
  left: -2px;
`

export default function ExploringStep() {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.exploringStep' })
  const { ADVENTURE } = useContractAddresses()
  const now = new Date()
  const { otto, setOtto } = useOtto()
  const { updateOtto } = useMyOttos()
  const { MATIC } = useTokenInfo()
  const location = useSelectedAdventureLocation()
  const { finishState, finish, resetFinish, finishResult } = useAdventureFinish()
  const { state: usePotionsState, send: applyPotions, resetState: resetUsePotions } = useUsePotions()
  const goToResult = useGoToAdventureResultStep()
  const [usedPotionAmounts, setUsedPotionAmounts] = useState<Record<string, number>>({})
  const usedPotionIds = useMemo(
    () =>
      Object.keys(usedPotionAmounts)
        .map(key => {
          const amount = usedPotionAmounts[key]
          const idList: number[] = []
          for (let i = 0; i < amount; i += 1) {
            idList.push(Number(key))
          }
          return idList
        })
        .reduce((all, list) => all.concat(list), [] as number[]),
    [usedPotionAmounts]
  )
  const canFinishAt = otto?.latestAdventurePass?.canFinishAt ?? now
  const formattedDuration = formatDistance(canFinishAt, otto?.latestAdventurePass?.departureAt ?? 0)
  const finishFee = useFinishFee(otto?.latestAdventurePass?.id)
  const loading = finishState.state === 'Processing' || usePotionsState.status === 'Mining'

  const onClick = (immediately: boolean) => {
    if (!otto) {
      return
    }
    const finishedAt = calcRemainingTime(otto.latestAdventurePass!.canFinishAt!, usedPotionIds)
    if (immediately || finishedAt.getTime() <= Date.now()) {
      finish(otto.id, immediately, usedPotionIds)
    } else {
      applyPotions(otto.id, usedPotionIds)
    }
  }

  useEffect(() => {
    if (finishState.state === 'Success' && otto && finishState.status.transaction?.hash && location) {
      otto.raw.resting_until = finishResult?.restingUntil.toISOString()
      updateOtto(otto)
      goToResult({ ottoId: otto.id, tx: finishState.status.transaction.hash, locationId: location.id, showEvent: true })
    } else if (finishState.state === 'Fail') {
      alert(finishState.status.errorMessage)
      resetFinish()
    }
  }, [finishState, resetFinish, otto])

  useEffect(() => {
    if (!otto) {
      return
    }
    if (usePotionsState.status === 'Success' && otto.latestAdventurePass && otto.raw.latest_adventure_pass) {
      const finishedAt = calcRemainingTime(otto.latestAdventurePass.canFinishAt, usedPotionIds)
      otto.raw.latest_adventure_pass.can_finish_at = finishedAt.toISOString()
      setOtto(otto.clone())
      updateOtto(otto)
      setUsedPotionAmounts({})
      resetUsePotions()
    } else if (usePotionsState.status === 'Fail') {
      alert(finishState.status.errorMessage)
      resetUsePotions()
    }
  }, [usePotionsState.status])

  if (!otto || !location) {
    return null
  }

  return (
    <StyledExploringStep bg={location.bgImageBlack}>
      <StyledContent>
        <StyledTitle>{t('title', { name: otto.name })}</StyledTitle>
        <StyledOttoPlace bg={location.bgImage}>
          <StyledName location={location} />
          <StyledOtto src={otto.imageWoBg} />
          <StyledDuration>
            <Image src={TimeIcon} width={18} height={18} unoptimized />
            {formattedDuration}
          </StyledDuration>
        </StyledOttoPlace>
        {now >= canFinishAt && (
          <>
            <Button Typography={ContentLarge} loading={loading} onClick={() => onClick(false)}>
              {t('see_results_btn')}
            </Button>
            <StyledSeeResultHint>{t('see_results_hint')}</StyledSeeResultHint>
          </>
        )}
        {now < canFinishAt && (
          <>
            <SpeedUpPotions
              disabled={loading}
              targetDate={canFinishAt}
              potions={usedPotionAmounts}
              onUsedPotionsUpdate={amounts => setUsedPotionAmounts(amounts)}
            />
            {usedPotionIds.length === 0 && (
              <PaymentButton
                width="100%"
                spenderAddress={ADVENTURE}
                loading={loading}
                amount={finishFee}
                token={MATIC}
                Typography={ContentLarge}
                padding="6px 20px 0"
                onClick={() => onClick(true)}
              >
                {t('finish_immediately_btn')}
              </PaymentButton>
            )}
            {usedPotionIds.length > 0 && (
              <Button
                loading={loading}
                width="100%"
                Typography={ContentLarge}
                padding="6px 20px 0"
                onClick={() => onClick(false)}
              >
                {t('speed_up_btn')}
              </Button>
            )}
            {/* TODO: enable this after potion start sell <StyledHint>
              {t('wants_more')}
              <a target="_blank">{t('buy_now')}</a>
            </StyledHint> */}
          </>
        )}
      </StyledContent>
    </StyledExploringStep>
  )
}
