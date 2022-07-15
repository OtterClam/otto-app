import CLAMCoin from 'assets/icons/CLAM.svg'
import { useClamPrice, useStakedBalance, useTreasuryRealtimeMetrics } from 'contracts/views'
import TreasurySection from 'components/TreasurySection'
import {
  useTotalDepositedAmount,
  useNextRewardTime,
  useDepositedAmount,
  useTotalStakedAmount,
  useTotalRewardsAmount,
} from 'contracts/functions'
import { ethers, BigNumber, utils, constants } from 'ethers'
import formatDistance from 'date-fns/formatDistanceStrict'
import { trim } from 'helpers/trim'
import { useBreakPoints } from 'hooks/useMediaQuery'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { ContentSmall, Note } from 'styles/typography'
import StakeDialog from '../StakeDialog'
import BadgeLeft from './badge-left.svg'
import BadgeRight from './badge-right.svg'
import Bottom1 from './bottom-1.png'
import Bottom2 from './bottom-2.png'
import GashaponTicketEn from './gashapon-ticket-en.jpg'
import GashaponTicketZh from './gashapon-ticket-zh.jpg'
import Middle from './middle.png'
import Top1 from './top-1.png'
import Top2 from './top-2.png'

const Animation = keyframes`
  0%   {opacity: 0;}
  50%  {opacity: 1;}
`

const StyledStakeInfo = styled.div`
  width: 420px;
  /* background: url(${Top1.src}) no-repeat center top/contain, url(${Bottom1.src}) no-repeat center bottom/contain; */

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledBackground1 = styled.div<{ delay: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(${Top1.src}) no-repeat center top/contain, url(${Bottom1.src}) no-repeat center bottom/contain;
  animation: ${Animation} 1000ms infinite;
  animation-delay: ${({ delay }) => delay}ms;
  animation-timing-function: steps(1);
`

const StyledBackground2 = styled.div<{ delay: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: url(${Top2.src}) no-repeat center top/contain, url(${Bottom2.src}) no-repeat center bottom/contain;
  animation: ${Animation} 1000ms infinite;
  animation-delay: ${({ delay }) => delay}ms;
  animation-timing-function: steps(1);
`

const StyledBody = styled.div`
  margin-top: 220px;
  margin-bottom: 78px;
  background: url(${Middle.src}) repeat-y center center/contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin-top: 46vw;
    margin-bottom: 85px;
    padding: 15px;
  }
`

const StyledTVL = styled(ContentSmall).attrs({ as: 'div' })`
  position: absolute;
  padding: 6px 24px;
  background: ${({ theme }) => theme.colors.white};
  border: 4px solid ${({ theme }) => theme.colors.darkBrown};
  top: 160px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    top: 30vw;
  }

  &:before {
    content: '';
    position: absolute;
    background: center / auto 28px url(${BadgeLeft.src});
    background-position: left center;
    width: 12px;
    height: 28px;
    top: 2px;
    left: -14px;
  }
  &:after {
    content: '';
    position: absolute;
    background: center / auto 28px url(${BadgeRight.src});
    background-position: right center;
    width: 12px;
    height: 28px;
    top: 2px;
    right: -14px;
  }
`

const StyledSection = styled(TreasurySection).attrs({ showRope: false })`
  width: 280px;
  background: ${({ theme }) => theme.colors.lightGray200};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledSectionTitle = styled(ContentSmall).attrs({ as: 'h2' })`
  width: 100%;
  background: ${({ theme }) => theme.colors.darkBrown};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  padding: 6px 0;
`

const StyledSectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px 12px 14px 12px;
`

const StyledClamBalanceContainer = styled.div`
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  padding: 6px 20px;
`

const StyledClamBalance = styled(ContentSmall)`
  display: flex;
  align-items: center;
  flex: 1;
  &:before {
    content: '';
    /* display: block; */
    background: no-repeat center/contain url(${CLAMCoin.src});
    width: 22px;
    height: 22px;
    margin-right: 5px;
  }
`

const StyledInfos = styled.div``

const StyledInfoContainer = styled(Note).attrs({ as: 'div' })`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledInfoTitle = styled.p<{ icon?: string }>`
  display: flex;
  align-items: center;
  &:before {
    content: '';
    display: ${({ icon }) => (icon ? 'block' : 'none')};
    background: no-repeat center/contain url(${({ icon }) => icon});
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
`

const StyledHint = styled(Note).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.darkGray100};
`

const StyledSubtitle = styled(Note).attrs({ as: 'p' })``

const StyledExtraRewards = styled(Note).attrs({ as: 'p' })`
  text-align: center;
`

const StyledGashaponTicket = styled.img`
  width: 100%;
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
`

const StyledStakedDialog = styled(StakeDialog)`
  width: 100%;
  margin-top: -20px;
`

interface Props {
  className?: string
}

export default function StakeInfo({ className }: Props) {
  const { t, i18n } = useTranslation('', { keyPrefix: 'stake' })
  const { isMobile } = useBreakPoints()
  const totalStaked = useTotalStakedAmount()
  const totalRewards = useTotalRewardsAmount()
  const totalDepositedAmount = useTotalDepositedAmount()
  const clamPrice = useClamPrice()
  const tvl = totalDepositedAmount.mul(clamPrice ?? constants.Zero)
  const depositedAmount = useDepositedAmount()
  const nextRewardTime = useNextRewardTime()
  const countdown = useMemo(() => {
    return formatDistance(new Date(), nextRewardTime.toNumber() * 1000)
  }, [nextRewardTime])
  const myRewards = useMemo(() => {
    if (totalStaked.eq(0)) {
      return constants.Zero
    }
    return totalRewards.mul(depositedAmount.mul(1000)).div(totalStaked)
  }, [depositedAmount, totalStaked, totalRewards])
  const apy = useMemo(() => {
    if (totalRewards.eq(0) || !clamPrice || clamPrice.eq(0)) {
      return constants.Zero
    }
    const dailyYield = Number(
      utils.formatUnits(totalRewards.mul(1e9).mul(1e9).mul(365).div(totalStaked.mul(clamPrice)), 6)
    )
    return (1 + dailyYield) ** 365 - 1
  }, [clamPrice, totalRewards, totalStaked])

  return (
    <StyledStakeInfo className={className}>
      <StyledBackground1 delay={0} />
      <StyledBackground2 delay={500} />
      <StyledBody>
        <StyledTVL>{t('tvl', { tvl: trim(ethers.utils.formatUnits(tvl, 18), 2) })}</StyledTVL>
        {isMobile && <StyledStakedDialog />}
        <StyledSection>
          <StyledSectionTitle>
            {t('next_reward')}
            <StyledSubtitle>{t('rebase_countdown', { countdown })}</StyledSubtitle>
          </StyledSectionTitle>
          <StyledSectionBody>
            <StyledClamBalanceContainer>
              <StyledClamBalance>{trim(utils.formatUnits(depositedAmount, 9), 4)} CLAM</StyledClamBalance>
            </StyledClamBalanceContainer>
            <StyledInfos>
              <StyledInfoContainer>
                <StyledInfoTitle>{t('next_reward_yield')}</StyledInfoTitle>
                <p>{trim(utils.formatUnits(myRewards, 9), 4)} USD+</p>
              </StyledInfoContainer>
              <StyledInfoContainer>
                <StyledInfoTitle>{t('apy')}</StyledInfoTitle>
                <p>{trim(apy, 2)}%</p>
              </StyledInfoContainer>
            </StyledInfos>
            <StyledExtraRewards>{t('extra_rewards')}</StyledExtraRewards>
            <StyledGashaponTicket
              src={i18n.resolvedLanguage === 'zh-tw' ? GashaponTicketZh.src : GashaponTicketEn.src}
            />
          </StyledSectionBody>
        </StyledSection>
      </StyledBody>
    </StyledStakeInfo>
  )
}
