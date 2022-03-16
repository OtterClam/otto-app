import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Caption, ContentMedium, Headline } from 'styles/typography'

const WHITELIST_MINT_TIME = 1647694800000 // 2022/3/19 21:00+8

const StyledCountdown = styled.section`
  width: 100%;
  height: 166px;
  background-color: ${({ theme }) => theme.colors.otterBlue};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledTitle = styled.p``

const StyledCountdownContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`

const StyledNumberSlot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const StyledNumbers = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`

const StyledNumber = styled.p`
  width: 36px;
  height: 48px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.otterBlack};
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledUnit = styled.p``

function NumberSlot({ num, unit }: { num: number; unit: string }) {
  const firstDigit = Math.floor(num / 10) % 10
  const secondDigit = num % 10
  return (
    <StyledNumberSlot>
      <StyledNumbers>
        <StyledNumber>
          <Headline>{firstDigit}</Headline>
        </StyledNumber>
        <StyledNumber>
          <Headline>{secondDigit}</Headline>
        </StyledNumber>
      </StyledNumbers>
      <StyledUnit>
        <Caption>{unit}</Caption>
      </StyledUnit>
    </StyledNumberSlot>
  )
}

export default function Countdown() {
  const { t } = useTranslation()
  const [countdown, setCountdown] = useState(WHITELIST_MINT_TIME - Date.now())
  const days = Math.floor(countdown / (1000 * 60 * 60 * 24))
  const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(WHITELIST_MINT_TIME - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <StyledCountdown>
      <StyledTitle>
        <ContentMedium>{t('mint.countdown.preWhiteListSale')}</ContentMedium>
      </StyledTitle>
      <StyledCountdownContainer>
        <NumberSlot num={days} unit={t('mint.countdown.days')} />
        <NumberSlot num={hours} unit={t('mint.countdown.hours')} />
        <NumberSlot num={minutes} unit={t('mint.countdown.minutes')} />
        <NumberSlot num={seconds} unit={t('mint.countdown.seconds')} />
      </StyledCountdownContainer>
    </StyledCountdown>
  )
}
