import InfoIcon from 'assets/ui/info.svg'
import Ribbon from 'assets/ui/ribbon.png'
import Button from 'components/Button'
import Countdown from 'components/Countdown'
import { TOTAL_RARITY_REWARD } from 'constant'
import useRarityEpoch from 'hooks/useRarityEpoch'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { Headline, ContentSmall, Display1, Note } from 'styles/typography'
import Background from './background.png'
import Clams from './clams.png'
import Ottos from './ottos.png'
import Rewards from './rewards.png'
import StreamerLeft from './streamer_left.png'
import StreamerRight from './streamer_right.png'

const StyledHero = styled.div`
  width: 100%;
  height: 404px;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 15px;
  position: relative;
  background: ${({ theme }) => theme.colors.darkGray400};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    height: auto;
    padding: 25px 5px;
    align-items: center;
  }

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

const StyledStreamerLeft = styled.img`
  position: absolute;
  left: 7px;
  top: 7px;
  width: 294px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 162px;
  }
`

const StyledRewardImg = styled.img`
  position: absolute;
  width: 35vw;
  max-width: 500px;
  left: 0;
  bottom: 15px;
  z-index: 1;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    position: static;
  }
`

const StyledCenterContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: 10%;
  z-index: 4;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 5px;
    position: static;
    text-align: center;
    right: unset;
  }
`

const StyledTitle = styled(ContentSmall).attrs({ as: 'h2' })`
  text-align: center;
  height: 53px;
  color: ${({ theme }) => theme.colors.white};
  background-image: url(${Ribbon.src});
  background-size: 100% 53px;
  background-repeat: no-repeat;
  padding: 6px 45px 0 45px;
`

const StyledTotalReward = styled(Display1).attrs({ as: 'h2' })`
  color: ${({ theme }) => theme.colors.crownYellow};
`

const StyledRewardAt = styled(ContentSmall).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;

  &:after {
    content: ' ';
    width: 18px;
    height: 18px;
    background-image: url(${InfoIcon.src});
    background-size: 100%;
  }
`

const StyledHint = styled(Note)`
  display: none;
  /* display: block; */
  position: absolute;
  color: ${({ theme }) => theme.colors.otterBlack};

  /* vertically center */
  top: 100%;
  transform: translateY(-50%);
  left: 20%;

  margin-top: 60px; /* and add a small left margin */

  /* basic styles */
  width: 300px;
  padding: 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
  text-align: center;

  filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));

  ${StyledRewardAt}:hover & {
    display: block;
  }

  /* the arrow */
  &:before {
    content: '';
    position: absolute;
    left: 80%;
    top: -20px;
    transform: rotate(90deg);

    border: 10px solid ${({ theme }) => theme.colors.white};
    border-color: transparent ${({ theme }) => theme.colors.white} transparent transparent;
  }
`

const StyledStreamRight = styled.img`
  position: absolute;
  width: 294px;
  top: 5px;
  right: 5px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 162px;
  }
`

const StyledOttos = styled.img`
  position: absolute;
  width: 710px;
  bottom: 5px;
  right: 0;
  z-index: 2;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledBackground = styled.img`
  position: absolute;
  width: calc(100% - 10px);
  bottom: 5px;
  left: 5px;
  border-radius: 12px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledClam = styled.img`
  width: 136px;
  position: absolute;
  left: -40px;
  bottom: -40px;
  z-index: 3;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledRoundEnd = styled(ContentSmall).attrs({ as: 'div' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.clamPink};
`

export default function Hero() {
  const { t } = useTranslation('', { keyPrefix: 'leaderboard.hero' })
  const { isLatestEpoch, epochEnd } = useRarityEpoch()
  return (
    <StyledHero>
      <StyledBackground src={Background.src} />
      <StyledStreamerLeft src={StreamerLeft.src} />
      <StyledStreamRight src={StreamerRight.src} />
      <StyledClam src={Clams.src} />
      <StyledOttos src={Ottos.src} />
      <StyledRewardImg src={Rewards.src} />
      <StyledCenterContainer>
        <StyledTitle>{t('title')}</StyledTitle>
        <StyledTotalReward>
          {new Intl.NumberFormat('en', {}).format(TOTAL_RARITY_REWARD)}
          <ContentSmall>CLAM</ContentSmall>
        </StyledTotalReward>
        <StyledRewardAt>
          {t('reward_at', { time: new Date(epochEnd).toLocaleString() })}
          <StyledHint>{t('tooltip')}</StyledHint>
        </StyledRewardAt>
        {isLatestEpoch ? (
          <Countdown target={epochEnd} />
        ) : (
          <StyledRoundEnd>
            {t('round_end')}
            <Link href="?epoch=-1">
              <a>
                <Button primaryColor="white" width="fit-content" Typography={Headline}>
                  {t('back_to_current')}
                </Button>
              </a>
            </Link>
          </StyledRoundEnd>
        )}
      </StyledCenterContainer>
    </StyledHero>
  )
}
