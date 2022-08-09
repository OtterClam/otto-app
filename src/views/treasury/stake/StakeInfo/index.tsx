import CLAMCoin from 'assets/tokens/CLAM.svg'
import USDPlus from 'assets/tokens/USDPlus.png'
import TreasurySection from 'components/TreasurySection'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useDepositedAmount, useNextRewardTime } from 'contracts/views'
import formatDistance from 'date-fns/formatDistanceStrict'
import { trim } from 'helpers/trim'
import useLastPayoutToAccount from 'hooks/useLastPayout'
import usePearlBankMetrics from 'hooks/usePearlBankMetrics'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components/macro'
import { ContentMedium, ContentSmall, Note } from 'styles/typography'
import { formatClamDecimals, formatClamEthers, formatUsd } from 'utils/currency'
import StakeDialog from '../StakeDialog'
import BadgeLeft from './badge-left.svg'
import BadgeRight from './badge-right.svg'
import BottomBg from './bottom.png'
import GashaponTicketEn from './gashapon-ticket-en.jpg'
import GashaponTicketZh from './gashapon-ticket-zh.jpg'
import Middle from './middle.png'
import TopBg from './top.png'

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

const StyledClamBalance = styled(ContentMedium)`
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

const StyledPayoutBalance = styled.p`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: end;
`

const StyledPayoutBalanceContent = styled.span`
  min-width: 66px;
  text-align: right;
`

const StyledInfos = styled(ContentMedium)``

const StyledInfoContainer = styled(Note).attrs({ as: 'div' })`
  width: 100%;
  display: flex;
  justify-content: space-between;
  justify-items: normal;
  align-items: start;
`

const StyledInfoTitle = styled.p<{ icon?: string }>`
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

const StyledRewardRate = styled.p`
  justify-content: end;
  display: flex;
`

interface Props {
  className?: string
}

export default function StakeInfo({ className }: Props) {
  const { t, i18n } = useTranslation('', { keyPrefix: 'stake' })
  const { isMobile } = useBreakpoints()
  const depositedAmount = useDepositedAmount()
  const { latestMetrics } = usePearlBankMetrics()
  const { payout } = useLastPayoutToAccount()

  const nextRewardTime = useNextRewardTime()
  const countdown = useMemo(() => {
    return formatDistance(new Date(), nextRewardTime.toNumber() * 1000)
  }, [nextRewardTime])

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
              {payout ? (
                <StyledInfoContainer>
                  <StyledInfoTitle>{t('lastPayout')}</StyledInfoTitle>
                  <div>
                    <StyledPayoutBalance>
                      + <Image src={USDPlus} width={22} height={22} unoptimized />
                      <StyledPayoutBalanceContent>
                        {formatUsd(payout?.clamPondLastPayoutUsd, 2)} USD+
                      </StyledPayoutBalanceContent>
                    </StyledPayoutBalance>
                    <StyledPayoutBalance>
                      =
                      <Image src={CLAMCoin} width={22} height={22} unoptimized />
                      <StyledPayoutBalanceContent>
                        {formatClamDecimals(payout?.clamPondLastPayout, 2, true)}
                      </StyledPayoutBalanceContent>
                    </StyledPayoutBalance>
                  </div>
                </StyledInfoContainer>
              ) : null}
              <StyledInfoContainer>
                <StyledInfoTitle>{t('lastYield')}</StyledInfoTitle>
                <StyledRewardRate>{trim(latestMetrics?.rewardRate, 3)}%</StyledRewardRate>
              </StyledInfoContainer>
              <StyledInfoContainer>
                <StyledInfoTitle>{t('apy')}</StyledInfoTitle>
                <StyledRewardRate>{trim(latestMetrics?.apy, 2)}%</StyledRewardRate>
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
