import Countdown from 'components/Countdown'
import Help from 'components/Help'
import Price from 'components/Price'
import { Token, TOTAL_RARITY_REWARD, TOTAL_ADVENTURE_REWARD } from 'constant'
import { useRarityEpoch } from 'contexts/RarityEpoch'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption, ContentMedium, Headline, ContentSmall } from 'styles/typography'
import InfoImage from 'assets/ui/info.svg'
import Button from 'components/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BigNumber } from 'ethers'
import IconImage from './icon.png'
import FishImage from './fish-icon.png'

const StyledContainer = styled.div<{ isAdventure: boolean }>`
  padding: 10px 50px 10px 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};

  &::before {
    content: '';
    display: block;
    min-width: ${IconImage.width / 2}px;
    max-width: ${IconImage.width / 2}px;
    height: ${IconImage.height / 2}px;
    background: center / cover url(${({ isAdventure }) => (isAdventure ? FishImage.src : IconImage.src)});

    @media ${({ theme }) => theme.breakpoints.mobile} {
      width: 155px;
      min-width: unset;
      max-width: unset;
      min-height: 120px;
      max-height: 120px;
    }
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    text-align: center;
  }
`

const StyledReward = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const StyledTime = styled.div`
  display: flex;
  align-items: end;
  flex-direction: column;
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    align-items: center;
  }
`

const StyledRewardAt = styled(Caption)`
  display: flex;
  align-items: center;
  gap: 10px;

  &::after {
    content: '';
    display: inline-block;
    width: 18px;
    height: 18px;
    background: center / cover url(${InfoImage.src});
  }
`

const StyledRoundEnd = styled(ContentSmall).attrs({ as: 'div' })`
  display: flex;
  flex-direction: column;
  align-items: end;
  color: ${({ theme }) => theme.colors.clamPink};
`

export default function EpochInfo() {
  const { query } = useRouter()
  const isAdventure = Boolean(query.adventure)
  const { t } = useTranslation('', { keyPrefix: 'leaderboard.hero' })
  const { isLatestEpoch, epochEndTime } = useRarityEpoch()
  const epochEnd = Date.now() > epochEndTime
  const rewardAmount = isAdventure
    ? BigNumber.from(String(TOTAL_ADVENTURE_REWARD)).mul(String(1e18))
    : BigNumber.from(String(TOTAL_RARITY_REWARD)).mul(String(1e9))

  return (
    <StyledContainer isAdventure={isAdventure}>
      <StyledReward>
        <ContentMedium>{t('title')}</ContentMedium>
        <Headline>
          <Price token={isAdventure ? Token.Fish : Token.Clam} amount={rewardAmount} showSymbol />
        </Headline>
      </StyledReward>
      <StyledTime>
        <Help message={t('tooltip')} noicon>
          <StyledRewardAt>{t('reward_at', { time: new Date(epochEndTime).toLocaleString() })}</StyledRewardAt>
        </Help>
        {epochEnd && (
          <StyledRoundEnd>
            {t('round_end')}
            {!isLatestEpoch && (
              <Link href="?epoch=-1">
                <a>
                  <Button primaryColor="white" width="fit-content" Typography={Headline}>
                    {t('back_to_current')}
                  </Button>
                </a>
              </Link>
            )}
          </StyledRoundEnd>
        )}
        {!epochEnd && <Countdown target={epochEndTime} />}
      </StyledTime>
    </StyledContainer>
  )
}
