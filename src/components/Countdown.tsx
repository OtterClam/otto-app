import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Note, ContentLarge } from 'styles/typography'

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

const StyledNumber = styled.span`
  width: 28px;
  height: 36px;
  border-radius: 4px;
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
          <ContentLarge>{firstDigit}</ContentLarge>
        </StyledNumber>
        <StyledNumber>
          <ContentLarge>{secondDigit}</ContentLarge>
        </StyledNumber>
      </StyledNumbers>
      <StyledUnit>
        <Note>{unit}</Note>
      </StyledUnit>
    </StyledNumberSlot>
  )
}

interface Props {
  target: number
}

export default function Countdown({ target }: Props) {
  const { t } = useTranslation()
  const [countdown, setCountdown] = useState(Math.max(target - Date.now(), 0))
  const days = Math.floor(countdown / (1000 * 60 * 60 * 24))
  const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(Math.max(target.valueOf() - Date.now(), 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [target])

  return (
    <StyledCountdown>
      <NumberSlot num={days} unit={t('mint.countdown.days')} />
      <NumberSlot num={hours} unit={t('mint.countdown.hours')} />
      <NumberSlot num={minutes} unit={t('mint.countdown.minutes')} />
      <NumberSlot num={seconds} unit={t('mint.countdown.seconds')} />
    </StyledCountdown>
  )
}
