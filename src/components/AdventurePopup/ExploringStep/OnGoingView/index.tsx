import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components/macro'
import { ContentLarge, ContentMedium, Note } from 'styles/typography'
import TimeIcon from 'assets/icons/icon_time.svg'
import { useSelectedAdventureLocation } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import { useAdventureOtto } from 'contexts/AdventureOttos'
import useFormatedDuration from 'hooks/useFormatedDuration'
import { formatDuration, intervalToDuration } from 'date-fns'
import PaymentButton from 'components/PaymentButton'
import { AdventurePotion, Token } from 'constant'
import useContractAddresses from 'hooks/useContractAddresses'
import useAdventurePotion from 'hooks/useAdventurePotion'
import AdventureLocationName from 'components/AdventureLocationName'
import SpeedUpPotion from './SpeedUpPotion'
import SpeedPotion from './speed-up-potion.png'

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

const StyledName = styled(AdventureLocationName)`
  position: absolute;
  top: 0;
  left: -2px;
`

export default function OnGoingView() {
  const { ADVENTURE } = useContractAddresses()
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.exploringStep' })
  const location = useSelectedAdventureLocation()!
  const { otto } = useOtto()
  const adventureOtto = useAdventureOtto(otto?.tokenId)
  const formatedDuration = useFormatedDuration(adventureOtto?.canFinishedAt ?? new Date())
  const duration = intervalToDuration({
    start: new Date(),
    end: adventureOtto?.canFinishedAt ?? new Date(),
  })
  const { amounts, usePotion: applyPotion, loading } = useAdventurePotion()

  if (!otto || !adventureOtto) {
    return <div />
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
            {formatedDuration}
          </StyledDuration>
        </StyledOttoPlace>
        <StyledRemaining>{t('remaining', { time: formatDuration(duration) })}</StyledRemaining>
        <StyledPotionContainer>
          <SpeedUpPotion
            loading={loading}
            onClick={() => applyPotion(AdventurePotion.OneHourSpeedy, otto.tokenId)}
            image={SpeedPotion.src}
            hasAmount={amounts[AdventurePotion.OneHourSpeedy]}
            reducedTime="1h"
          />
          <SpeedUpPotion
            loading={loading}
            onClick={() => applyPotion(AdventurePotion.ThreeHourSpeedy, otto.tokenId)}
            image={SpeedPotion.src}
            hasAmount={amounts[AdventurePotion.ThreeHourSpeedy]}
            reducedTime="3h"
          />
          <SpeedUpPotion
            loading={loading}
            onClick={() => applyPotion(AdventurePotion.SixHourSpeedy, otto.tokenId)}
            image={SpeedPotion.src}
            hasAmount={amounts[AdventurePotion.SixHourSpeedy]}
            reducedTime="6h"
          />
        </StyledPotionContainer>
        <PaymentButton
          width="100%"
          spenderAddress={ADVENTURE}
          amount={4 * 1e9}
          token={Token.Clam}
          Typography={ContentLarge}
          padding="6px 20px 0"
        >
          {t('finish_immediately_btn')}
        </PaymentButton>
        <StyledHint>
          {t('wants_more')}
          <a target="_blank">{t('buy_now')}</a>
        </StyledHint>
      </StyledContent>
    </StyledExploringStep>
  )
}
