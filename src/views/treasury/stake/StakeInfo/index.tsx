import CLAMCoin from 'assets/tokens/CLAM.svg'
import TreasurySection from 'components/TreasurySection'
import { useClamPrice, useDepositedAmount, useNextRewardTime, usePearlBankInfo } from 'contracts/views'
import formatDistance from 'date-fns/formatDistanceStrict'
import { constants, ethers, utils } from 'ethers'
import { trim } from 'helpers/trim'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components/macro'
import { ContentSmall, Note } from 'styles/typography'
import { formatClamEthers, formatUsd } from 'utils/currency'
import StakeDialog from '../StakeDialog'
import BadgeLeft from './badge-left.svg'
import BadgeRight from './badge-right.svg'
import BottomBg from './bottom.png'
import TopBg from './top.png'
import GashaponTicketEn from './gashapon-ticket-en.jpg'
import GashaponTicketZh from './gashapon-ticket-zh.jpg'
import Middle from './middle.png'
import usePearlBankMetrics from 'hooks/usePearlBankMetrics'

const Animation = keyframes`
  0%   { background-position: left top }
  50%  { background-position: right top }
`

const AnimationCSS = css`
  animation: ${Animation} 2000ms steps(1) infinite;
`

const StyledStakeInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }

  &::after,
  &::before {
    content: '';
    width: 100%;
    ${AnimationCSS}

    @media ${({ theme }) => theme.breakpoints.mobile} {
      width: 100%;
    }
  }

  &::before {
    background: left top / 200% 100% url(${TopBg.src}) no-repeat;
    padding-bottom: 52.8571428571%;
    min-height: 0;
    max-height: 0;
  }

  &::after {
    background: left top / 200% 100% url(${BottomBg.src}) no-repeat;
    padding-bottom: 25.7142857143%;
    min-height: 0;
    max-height: 0;
  }
`

const StyledBody = styled.div`
  flex: 1;
  background: url(${Middle.src}) repeat-y center center/contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 15px;
  }
`

const StyledTVLContainer = styled.div`
  margin-top: -24%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin-bottom: 24px;
  }
`

const StyledTVL = styled(ContentSmall).attrs({ as: 'div' })`
  position: relative;
  padding: 6px 24px;
  background: ${({ theme }) => theme.colors.white};
  border: 4px solid ${({ theme }) => theme.colors.darkBrown};
  text-align: center;

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
  const { isMobile } = useBreakpoints()
  const { latestTotalReward, lastTotalStaked } = usePearlBankInfo()
  const clamPrice = useClamPrice()
  const depositedAmount = useDepositedAmount()
  const { metrics, latestMetrics } = usePearlBankMetrics()

  const nextRewardTime = useNextRewardTime()
  const countdown = useMemo(() => {
    return formatDistance(new Date(), nextRewardTime.toNumber() * 1000)
  }, [nextRewardTime])
  // const myRewards = useMemo(() => {
  //   if (totalStaked.eq(0)) {
  //     return constants.Zero
  //   }
  //   return totalRewards.mul(depositedAmount.mul(1000)).div(totalStaked)
  // }, [depositedAmount, totalStaked, totalRewards])

  return (
    <StyledStakeInfo className={className}>
      <StyledBody>
        <StyledTVLContainer>
          <StyledTVL>
            {t('tvl')} <br />
            {formatUsd(latestMetrics?.clamPondDepositedUsdValue)}
          </StyledTVL>
        </StyledTVLContainer>
        {isMobile && <StyledStakedDialog />}
        <StyledSection>
          <StyledSectionTitle>
            {t('next_reward')}
            <StyledSubtitle>{t('rebase_countdown', { countdown })}</StyledSubtitle>
          </StyledSectionTitle>
          <StyledSectionBody>
            <StyledClamBalanceContainer>
              <StyledClamBalance>{formatClamEthers(depositedAmount)} CLAM</StyledClamBalance>
            </StyledClamBalanceContainer>
            <StyledInfos>
              {/* <StyledInfoContainer>
                <StyledInfoTitle>{t('next_reward_yield')}</StyledInfoTitle>
                <p>{trim(utils.formatUnits(myRewards, 9), 4)} USD+</p>
              </StyledInfoContainer> */}
              <StyledInfoContainer>
                <StyledInfoTitle>{t('apy')}</StyledInfoTitle>
                <p>{trim(latestMetrics?.apy, 2)}%</p>
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
