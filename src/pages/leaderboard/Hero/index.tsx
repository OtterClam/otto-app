import Button from 'components/Button'
import { DISCORD_LINK } from 'constant'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentSmall, Display1, Headline } from 'styles/typography'
import Ribbon from 'assets/ui/ribbon.png'
import InfoIcon from 'assets/ui/info.svg'
import Left from './left.png'
import Right from './right.png'

const StyledHero = styled.div`
  width: 100%;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 15px;
  position: relative;
  background: ${({ theme }) => theme.colors.darkGray400};

  &:before {
    content: ' ';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border: 5px solid ${({ theme }) => theme.colors.crownYellow};
    border-radius: 12px;
    pointer-events: none;
  }

  &:after {
    content: ' ';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 2px solid ${({ theme }) => theme.colors.otterBlack};
    border-radius: 12px;
    pointer-events: none;
  }
`

const StyledImg = styled.img`
  width: 20%;
  /* height: fit-content; */
`

const StyledCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledTitle = styled(ContentSmall)`
  text-align: center;
  height: 53px;
  color: ${({ theme }) => theme.colors.white};
  background-image: url(${Ribbon});
  background-size: 100% 53px;
  background-repeat: no-repeat;
  padding: 6px 45px 0 45px;
`

const StyledComingSoon = styled(Display1)`
  color: ${({ theme }) => theme.colors.crownYellow};
`

const StyledRewardAt = styled(ContentSmall)`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  &:after {
    content: ' ';
    width: 18px;
    height: 18px;
    background-image: url(${InfoIcon});
    background-size: 100%;
  }
`

export default function Hero() {
  const { t } = useTranslation('', { keyPrefix: 'leaderboard.hero' })
  return (
    <StyledHero>
      <StyledImg src={Left} />
      <StyledCenterContainer>
        <StyledTitle as="h2">{t('title')}</StyledTitle>
        <StyledComingSoon>{t('coming_soon')}</StyledComingSoon>
        <StyledRewardAt as="p">{t('reward_at')}</StyledRewardAt>
        <a href={DISCORD_LINK} target="_blank" rel="noreferrer">
          <Button>
            <Headline>{t('get_updated')}</Headline>
          </Button>
        </a>
      </StyledCenterContainer>
      <StyledImg src={Right} />
    </StyledHero>
  )
}
