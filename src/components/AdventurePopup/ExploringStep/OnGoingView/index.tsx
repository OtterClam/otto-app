import { TransactionState, TransactionStatus } from '@usedapp/core'
import TimeIcon from 'assets/icons/icon_time.svg'
import AdventureLocationName from 'components/AdventureLocationName'
import Button from 'components/Button'
import PaymentButton from 'components/PaymentButton'
import { AdventurePotion, Token } from 'constant'
import { useAdventureOtto } from 'contexts/AdventureOttos'
import { useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import useAdventurePotion from 'hooks/useAdventurePotion'
import useContractAddresses from 'hooks/useContractAddresses'
import useFormattedDuration from 'hooks/useFormattedDuration'
import { AdventureOttoStatus } from 'models/AdventureOtto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ContentLarge, ContentMedium, Note } from 'styles/typography'
import SpeedPotion from './speed-up-potion.png'
import SpeedUpPotion from './SpeedUpPotion'

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

const StyledPotionContainer = styled.div`
  display: flex;
  gap: 30px;
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

interface Props {
  state: TransactionState
  onFinish: (immediately: boolean, potions: string[]) => void
}

export default function OnGoingView({ state, onFinish }: Props) {
  const { ADVENTURE } = useContractAddresses()
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.exploringStep' })
  const location = useSelectedAdventureLocation()!
  const { otto } = useOtto()
  const adventureOtto = useAdventureOtto(otto?.tokenId)
  const now = new Date()
  const canFinishAt = adventureOtto?.canFinishedAt ?? now
  const formattedDuration = useFormattedDuration(adventureOtto?.departuredAt ?? now, canFinishAt)
  const remainingDuration = useFormattedDuration(now, canFinishAt)
  const [usedPotionAmounts, setUsedPotionAmounts] = useState<{ [k: string]: number }>({})
  const { amounts, loading } = useAdventurePotion()
  const usedPotions = useMemo(() => {
    return Object.keys(usedPotionAmounts).map(key => {
      const amount = usedPotionAmounts[key]
      const idList: string[] = []
      for (let i = 0; i < amount; i += 1) {
        idList.push(key)
      }
      return idList
    })
  }, [usedPotionAmounts]).reduce((all, list) => all.concat(list), [] as string[])
  const potionButtonDisabled = loading || state === 'Mining'

  if (!otto || !adventureOtto) {
    return null
  }

  return (
    <StyledExploringStep bg={location.bgImageBlack}>
      <StyledContent>
        <StyledTitle>{t('title', { name: otto.name })}</StyledTitle>
        <StyledOttoPlace bg={location.bgImage}>
          <StyledName location={location} />
          <StyledOtto src={adventureOtto.imageWoBg} />
          <StyledDuration>
            <Image src={TimeIcon} width={18} height={18} unoptimized />
            {formattedDuration}
          </StyledDuration>
        </StyledOttoPlace>
        {adventureOtto.status === AdventureOttoStatus.Finished && (
          <>
            <Button
              Typography={ContentLarge}
              onClick={() => onFinish(false, [])}
              loading={state === 'Mining' || state === 'PendingSignature'}
            >
              {t('see_results_btn')}
            </Button>
            <StyledSeeResultHint>{t('see_results_hint')}</StyledSeeResultHint>
          </>
        )}
        {adventureOtto.status !== AdventureOttoStatus.Ongoing && (
          <>
            <StyledRemaining>{t('remaining', { time: remainingDuration })}</StyledRemaining>
            <StyledPotionContainer>
              <SpeedUpPotion
                disabled={potionButtonDisabled}
                potion={AdventurePotion.OneHourSpeedy}
                onChanged={setUsedPotionAmounts}
                image={SpeedPotion.src}
                amounts={amounts}
                usedAmounts={usedPotionAmounts}
                reducedTime="1h"
              />
              <SpeedUpPotion
                disabled={potionButtonDisabled}
                potion={AdventurePotion.ThreeHourSpeedy}
                onChanged={setUsedPotionAmounts}
                image={SpeedPotion.src}
                amounts={amounts}
                usedAmounts={usedPotionAmounts}
                reducedTime="3h"
              />
              <SpeedUpPotion
                disabled={potionButtonDisabled}
                potion={AdventurePotion.SixHourSpeedy}
                onChanged={setUsedPotionAmounts}
                image={SpeedPotion.src}
                amounts={amounts}
                usedAmounts={usedPotionAmounts}
                reducedTime="6h"
              />
            </StyledPotionContainer>
            {usedPotions.length <= 0 && (
              <PaymentButton
                width="100%"
                spenderAddress={ADVENTURE}
                loading={state === 'Mining'}
                amount={4 * 1e9}
                token={Token.Clam}
                Typography={ContentLarge}
                padding="6px 20px 0"
                onClick={() => onFinish(true, [])}
              >
                {t('finish_immediately_btn')}
              </PaymentButton>
            )}
            {usedPotions.length > 0 && (
              <Button
                loading={state === 'Mining'}
                width="100%"
                Typography={ContentLarge}
                padding="6px 20px 0"
                onClick={() => onFinish(true, usedPotions)}
              >
                {t('speedup_btn')}
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
