import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import styled from 'styled-components/macro'
import { ContentLarge, ContentMedium, Display1, Note } from 'styles/typography'
import TimeIcon from 'assets/icons/icon_time.svg'
import Button from 'components/Button'
import SpeedPotion from './speed-up-potion.png'
import SpeedUpPotion from './SpeedUpPotion'

const StyledExploringStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.white};
  gap: 10px;
  background: ${({ theme }) => theme.colors.otterBlue};
`

const StyledAvatar = styled.img`
  width: 140px;
  height: 140px;
`

const StyledTitle = styled(ContentLarge).attrs({ as: 'h1' })`
  text-align: center;
`

const StyledOttoPlace = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.superDarkBrown};
`

const StyledOtto = styled.img`
  position: absolute;
  left: calc(50% - 60px);
  bottom: 0;
  width: 120px;
  height: 120px;
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
  width: 100%;
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

interface Props {
  otto: Otto
}

export default function ExploringStep({ otto }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.exploringStep' })
  return (
    <StyledExploringStep>
      <StyledTitle>{t('title', { name: otto.name })}</StyledTitle>
      <StyledOttoPlace>
        <StyledOtto src={otto.image} />
        <StyledDuration>
          <Image src={TimeIcon} width={18} height={18} unoptimized />4 Hours
        </StyledDuration>
      </StyledOttoPlace>
      <StyledRemaining>{t('remaining', { time: '3 Hours 20 Minutes' })}</StyledRemaining>
      <StyledPotionContainer>
        <SpeedUpPotion image={SpeedPotion.src} hasAmount={5} useAmount={1} reducedTime="1h" />
        <SpeedUpPotion image={SpeedPotion.src} hasAmount={16} useAmount={0} reducedTime="3h" />
        <SpeedUpPotion image={SpeedPotion.src} hasAmount={8} useAmount={4} reducedTime="6h" />
      </StyledPotionContainer>
      <Button Typography={ContentLarge}>{t('finish_immediately_btn')}</Button>
      <StyledHint>
        {t('wants_more')}
        <a target="_blank">{t('buy_now')}</a>
      </StyledHint>
    </StyledExploringStep>
  )
}
