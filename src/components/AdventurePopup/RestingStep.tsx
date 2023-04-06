import TimeIcon from 'assets/icons/icon_time.svg'
import Button from 'components/Button'
import { ItemActionType } from 'constant'
import { AdventurePopupStep, useOpenAdventurePopup } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import { useDoItemBatchActions } from 'contracts/functions'
import formatDistance from 'date-fns/formatDistanceStrict'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ContentLarge, ContentMedium, Note } from 'styles/typography'
import SpeedUpPotions from './SpeedUpPotions'
import HotSpring from './hot-spring.jpg'

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

const StyledExploringStep = styled.div`
  padding: 40px;
  color: ${({ theme }) => theme.colors.white};
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

export default function RestingStep() {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.restingStep' })
  const openPopup = useOpenAdventurePopup()
  const { updateOtto } = useMyOttos()
  const { otto, setOtto } = useOtto()
  const now = new Date()
  const restingUntil = otto?.restingUntil ?? now
  const restFinished = restingUntil < now
  const formattedDuration = formatDistance(restingUntil, otto?.latestAdventurePass?.finishedAt ?? now)
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
  const { doItemBatchActions, doItemBatchActionsState, resetDoItemBatchActions } = useDoItemBatchActions()
  useEffect(() => {
    if (doItemBatchActionsState.state === 'Success' && otto) {
      otto.raw.resting_until = doItemBatchActionsState.restingUntil?.toISOString()
      setOtto(otto.clone())
      updateOtto(otto)
    } else if (doItemBatchActionsState.state === 'Fail') {
      alert(doItemBatchActionsState.status.errorMessage)
      resetDoItemBatchActions()
    }
  }, [otto, resetDoItemBatchActions, setOtto, updateOtto, doItemBatchActionsState])
  if (!otto) {
    return null
  }
  return (
    <StyledExploringStep>
      <StyledContent>
        <StyledTitle>{t(restFinished ? 'title_ready' : 'title', { name: otto.name })}</StyledTitle>
        <StyledOttoPlace bg={HotSpring.src}>
          <StyledOtto src={otto.imageWoBg} />
          <StyledDuration>
            <Image src={TimeIcon} width={18} height={18} unoptimized />
            {formattedDuration}
          </StyledDuration>
        </StyledOttoPlace>
        {restFinished && (
          <Button
            Typography={ContentLarge}
            onClick={() => {
              setOtto(otto)
              openPopup(undefined, AdventurePopupStep.Map)
            }}
          >
            {t('finish_btn')}
          </Button>
        )}
        {!restFinished && (
          <>
            <SpeedUpPotions
              targetDate={restingUntil}
              disabled={false}
              potions={usedPotionAmounts}
              onUsedPotionsUpdate={setUsedPotionAmounts}
            />
            <Button
              loading={doItemBatchActionsState.state === 'Processing'}
              width="100%"
              disabled={usedPotionIds.length === 0}
              Typography={ContentLarge}
              padding="6px 20px 0"
              onClick={() =>
                doItemBatchActions(
                  otto.id,
                  usedPotionIds.map(id => ({ item_id: id, type: ItemActionType.Use, from_otto_id: 0 }))
                )
              }
            >
              {t('speed_up_btn')}
            </Button>
            <StyledHint>
              {t('wants_more')}
              <a target="_blank">{t('buy_now')}</a>
            </StyledHint>
          </>
        )}
      </StyledContent>
    </StyledExploringStep>
  )
}
