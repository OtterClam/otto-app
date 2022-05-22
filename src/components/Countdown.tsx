import { WHITELIST_MINT_TIME } from 'constant'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { Caption, ContentMedium, Headline } from 'styles/typography'

const StyledCountdown = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  color: #fff;
  gap: 20px;
`

const StyledNumberSlot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    gap: 6px;
  }
`

const StyledNumbers = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`

const StyledNumber = styled.p`
  width: 28px;
  height: 36px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.otterBlue};
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 28px;
    height: 36px;
  }
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

interface Props {
  target: Date
}

export default function Countdown({ target }: Props) {
  const { t } = useTranslation()
  const [countdown, setCountdown] = useState(target.valueOf() - Date.now())
  const days = Math.floor(countdown / (1000 * 60 * 60 * 24))
  const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(target.valueOf() - Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <StyledCountdown>
      <NumberSlot num={days} unit={t('mint.countdown.days')} />
      <NumberSlot num={hours} unit={t('mint.countdown.hours')} />
      <NumberSlot num={minutes} unit={t('mint.countdown.minutes')} />
      <NumberSlot num={seconds} unit={t('mint.countdown.seconds')} />
    </StyledCountdown>
  )
}
