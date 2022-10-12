import TimeIcon from 'assets/icons/icon_time.svg'
import Button from 'components/Button'
import { useOtto } from 'contexts/Otto'
import formatDistance from 'date-fns/formatDistance'
import useRemainingTime from 'hooks/useRemainingTime'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ContentLarge, ContentMedium, Note } from 'styles/typography'
import SpeedUpPotions from './SpeedUpPotions'

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

const StyledRemaining = styled(ContentMedium).attrs({ as: 'p' })`
  padding: 8px 27px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.darkGray400};
`

const StyledHint = styled(Note).attrs({ as: 'p' })`
  a {
    color: ${({ theme }) => theme.colors.crownYellow};
  }
`

export default function RestingStep() {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.restingStep' })
  const { otto } = useOtto()
  const now = new Date()
  const restingUntil = otto?.restingUntil ?? now
  const restFinished = restingUntil < now
  const formattedDuration = formatDistance(restingUntil, otto?.latestAdventurePass?.finishedAt ?? now)
  const remainingDuration = useRemainingTime(restingUntil)
  const [usedPotionAmounts, setUsedPotionAmounts] = useState<number[]>([])

  if (!otto) {
    return null
  }

  return (
    <StyledExploringStep bg="">
      <StyledContent>
        <StyledTitle>{t(restFinished ? 'title_ready' : 'title', { name: otto.name })}</StyledTitle>
        <StyledOttoPlace bg="">
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
              // TODO: go to adventure location
            }}
          >
            {t('finish_btn')}
          </Button>
        )}
        {!restFinished && (
          <>
            <StyledRemaining>{t('remaining', { time: remainingDuration })}</StyledRemaining>
            <SpeedUpPotions disabled={false} onUsedPotionsUpdate={amounts => setUsedPotionAmounts(amounts)} />
            {usedPotionAmounts.length === 0 && (
              <Button
                width="100%"
                // loading={state === 'Processing'}
                Typography={ContentLarge}
                padding="6px 20px 0"
                // onClick={() => onFinish(true, [])}
              >
                {t('speed_up_btn')}
              </Button>
            )}
            {usedPotionAmounts.length > 0 && (
              <Button
                // loading={state === 'Processing'}
                width="100%"
                Typography={ContentLarge}
                padding="6px 20px 0"
                // onClick={() => onFinish(true, usedPotions)}
              >
                {t('speed_up_btn')}
              </Button>
            )}
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
