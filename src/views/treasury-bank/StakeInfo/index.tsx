import PearlBalance from 'assets/icons/pearl-balance.png'
import CLAMCoin from 'assets/tokens/CLAM.svg'
import USDPlus from 'assets/tokens/USDPlus.png'
import Button from 'components/Button'
import TreasurySection from 'components/TreasurySection'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useClaimRewards, usePearlBankBalance, useStakedInfo } from 'contracts/functions'
import { useNextRewardTime, usePearlBankAvailableReward } from 'contracts/views'
import formatDistance from 'date-fns/formatDistanceStrict'
import { trim } from 'helpers/trim'
import useLastPayoutToAccount from 'hooks/useLastPayout'
import usePearlBankMetrics from 'hooks/usePearlBankMetrics'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useMemo } from 'react'
import styled from 'styled-components'
import { ContentSmall, Note } from 'styles/typography'
import { formatClamEthers, formatUsd, formatUsdc } from 'utils/currency'
import StakeDialog from '../StakeDialog'
import BadgeLeft from './badge-left.svg'
import BadgeRight from './badge-right.svg'
import GashaponTicketEn from './gashapon-ticket-en.jpg'
import GashaponTicketZh from './gashapon-ticket-zh.jpg'

const StyledStakeInfo = styled.div`
  width: 420px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledBody = styled.div`
  margin-top: 138px;
  margin-bottom: 78px;
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

const StyledTVLContainer = styled.div`
  margin-top: -20%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin-bottom: 24px;
  }
`

const StyledTVL = styled(ContentSmall).attrs({ as: 'div' })`
  position: relative;
  text-align: center;
  padding: 6px 24px;
  background: ${({ theme }) => theme.colors.white};
  border: 4px solid ${({ theme }) => theme.colors.darkBrown};

  &:before {
    content: '';
    position: absolute;
    background: center / auto 28px url(${BadgeLeft.src});
    background-position: left center;
    width: 12px;
    height: 28px;
    top: 50%;
    left: -14px;
    transform: translateY(-14px);
  }

  &:after {
    content: '';
    position: absolute;
    background: center / auto 28px url(${BadgeRight.src});
    background-position: right center;
    width: 12px;
    height: 28px;
    top: 50%;
    right: -14px;
    transform: translateY(-14px);
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

const StyledClaimableBalanceContainer = styled(StyledClamBalanceContainer)`
  flex: 1;
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

const StyledUsdPlusBalance = styled(ContentSmall)`
  display: flex;
  align-items: center;
  flex: 1;
  &:before {
    content: '';
    /* display: block; */
    background: no-repeat center/contain url(${USDPlus.src});
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

const StyledInfoContainerLower = styled(Note).attrs({ as: 'div' })`
  width: 100%;
  display: flex;
  justify-content: space-between;
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

const StyledInfoTitleLower = styled.p<{ icon?: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
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

const StyledClaimableBalance = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const StyledPayoutBalance = styled.p<{ icon?: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
`

const StyledClaimButton = styled(Button)``

interface Props {
  className?: string
}

export default function StakeInfo({ className }: Props) {
  const { t, i18n } = useTranslation('', { keyPrefix: 'bank' })
  const { isMobile } = useBreakpoints()
  const { latestMetrics } = usePearlBankMetrics()
  const pearlBankBalance = usePearlBankBalance()
  const myStakedInfo = useStakedInfo()
  const nextRewardTime = useNextRewardTime()
  const availableUsdPlusReward = usePearlBankAvailableReward()
  const claim = useClaimRewards()
  const countdown = useMemo(() => {
    return formatDistance(new Date(), nextRewardTime.toNumber() * 1000)
  }, [nextRewardTime])
  const { payout } = useLastPayoutToAccount()

  return (
    <StyledStakeInfo className={className}>
      <StyledBody>
        <StyledTVLContainer>
          <StyledTVL>
            {t('tvl')}
            <br />
            {formatUsd(latestMetrics?.pearlBankDepositedUsdValue)}
          </StyledTVL>
        </StyledTVLContainer>
        {isMobile && <StyledStakedDialog />}
        <StyledSection>
          <StyledSectionTitle>{t('staked_balance')}</StyledSectionTitle>
          <StyledSectionBody>
            <StyledClamBalanceContainer>
              <StyledClamBalance>{formatClamEthers(myStakedInfo.amount)} CLAM</StyledClamBalance>
            </StyledClamBalanceContainer>
            <StyledInfos>
              <StyledInfoContainer>
                <StyledInfoTitle icon={PearlBalance.src}>{t('pearl_balance')}</StyledInfoTitle>
                <p>{formatClamEthers(pearlBankBalance)} PEARL</p>
              </StyledInfoContainer>
              <StyledInfoContainer>
                <p />
                <StyledHint>1 PEARL = 1 CLAM</StyledHint>
              </StyledInfoContainer>
            </StyledInfos>
          </StyledSectionBody>
        </StyledSection>
        <StyledSection>
          <StyledSectionTitle>
            {t('current_reward')}
            <StyledSubtitle>{t('rebase_countdown', { countdown })}</StyledSubtitle>
          </StyledSectionTitle>
          <StyledSectionBody>
            <StyledClaimableBalance>
              <StyledClaimableBalanceContainer>
                <StyledUsdPlusBalance>{formatUsdc(availableUsdPlusReward)} USD+</StyledUsdPlusBalance>
              </StyledClaimableBalanceContainer>
              <StyledClaimButton padding="2px 6px 2px 6px" Typography={ContentSmall} onClick={claim}>
                {t('claim')}
              </StyledClaimButton>
            </StyledClaimableBalance>
            <StyledInfos>
              {payout ? (
                <StyledInfoContainerLower>
                  <StyledInfoTitleLower>{t('lastPayout')}</StyledInfoTitleLower>
                  <StyledPayoutBalance>
                    + <Image src={USDPlus} width="22px" height="22px" />
                    {formatUsd(payout?.pearlBankLastPayout, 2)} USD+
                  </StyledPayoutBalance>
                </StyledInfoContainerLower>
              ) : null}

              <StyledInfoContainerLower>
                <StyledInfoTitleLower>{t('lastYield')}</StyledInfoTitleLower>
                <StyledPayoutBalance>{trim(latestMetrics?.rewardRate, 3)}%</StyledPayoutBalance>
              </StyledInfoContainerLower>
              <StyledInfoContainerLower>
                <StyledInfoTitleLower>{t('apr')}</StyledInfoTitleLower>
                <StyledPayoutBalance>{trim(latestMetrics?.apr, 2)}%</StyledPayoutBalance>
              </StyledInfoContainerLower>
            </StyledInfos>
            <StyledExtraRewards>{t('extra_rewards')}</StyledExtraRewards>
            <StyledGashaponTicket
              src={i18n.resolvedLanguage.startsWith('zh-') ? GashaponTicketZh.src : GashaponTicketEn.src}
            />
          </StyledSectionBody>
        </StyledSection>
      </StyledBody>
    </StyledStakeInfo>
  )
}
