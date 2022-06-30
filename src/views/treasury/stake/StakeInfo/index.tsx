import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { ContentSmall, Note } from 'styles/typography'
import TreasurySection from 'components/TreasurySection'
import CLAM from 'assets/clam.svg'
import CLAMCoin from 'assets/icons/CLAM.svg'
import PearlBalance from 'assets/icons/pearl-balance.png'
import PearlChest from 'assets/icons/pearl-chest.png'
import { useStakedBalance, useTreasuryRealtimeMetrics } from 'contracts/views'
import { BigNumber, ethers } from 'ethers'
import { trim } from 'helpers/trim'
import useTreasuryMetrics from 'hooks/useTreasuryMetrics'
import { useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import BadgeLeft from './badge-left.svg'
import BadgeRight from './badge-right.svg'
import Top1 from './top-1.png'
import Middle from './middle.png'
import Bottom1 from './bottom-1.png'
import ArrowDown from './arrow_down-yellow.svg'
import GashaponTicket from './gashapon-ticket.png'

const StyledStakeInfo = styled.div`
  width: 530px;
  background: url(${Top1.src}) no-repeat center top/contain, url(${Bottom1.src}) no-repeat center bottom/contain;
`

const StyledBody = styled.div`
  margin-top: 270px;
  margin-bottom: 130px;
  /* padding-bottom: 130px; */
  background: url(${Middle.src}) repeat-y center center/contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const StyledTVL = styled(ContentSmall).attrs({ as: 'div' })`
  position: relative;
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

const StyledPearlChestContainer = styled(Note).attrs({ as: 'div' })`
  background: ${({ theme }) => theme.colors.white};
  padding: 2px 6px;
  border-radius: 5px;
`

const StyledPearlChest = styled(Note).attrs({ as: 'div' })`
  display: flex;
  align-items: center;

  > span {
    color: ${({ theme }) => theme.colors.clamPink};
  }

  &:before {
    content: '';
    display: block;
    background: no-repeat center/contain url(${PearlChest.src});
    width: 18px;
    height: 15px;
    margin-right: 5px;
  }
`

const StyledExtraRewards = styled(Note).attrs({ as: 'p' })`
  text-align: center;
`

const StyledGashaponTicket = styled.img.attrs({ src: GashaponTicket.src })`
  width: 240px;
`

interface Props {
  className?: string
}

export default function StakeInfo({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const { account } = useEthers()
  const { tvd, index, nextRewardRate, apy } = useTreasuryRealtimeMetrics()
  const { sClamBalance, pearlBalance } = useStakedBalance(account)
  const totalStaked = useMemo(
    () => sClamBalance.mul(1e9).add(pearlBalance.mul(index).div(1e9)),
    [sClamBalance, pearlBalance]
  )
  const nextReward = (totalStaked / 1e18) * nextRewardRate
  const countdown = '7hr 30mins'
  return (
    <StyledStakeInfo className={className}>
      <StyledBody>
        <StyledTVL>{t('tvl', { tvl: trim(ethers.utils.formatUnits(tvd, 18), 2) })}</StyledTVL>
        <StyledSection>
          <StyledSectionTitle>{t('staked_balance')}</StyledSectionTitle>
          <StyledSectionBody>
            <StyledClamBalanceContainer>
              <StyledClamBalance>{trim(ethers.utils.formatEther(totalStaked), 4)} CLAM</StyledClamBalance>
            </StyledClamBalanceContainer>
            <StyledInfos>
              <StyledInfoContainer>
                <StyledInfoTitle icon={PearlBalance.src}>{t('pearl_balance')}</StyledInfoTitle>
                <p>{trim(ethers.utils.formatEther(pearlBalance), 4)} PEARL</p>
              </StyledInfoContainer>
              <StyledInfoContainer>
                <p />
                <StyledHint>{`1 PEARL = ${trim(ethers.utils.formatUnits(index, 9), 2)} CLAM`}</StyledHint>
              </StyledInfoContainer>
            </StyledInfos>
          </StyledSectionBody>
        </StyledSection>
        <img src={ArrowDown.src} alt="arrow down" />
        <StyledSection>
          <StyledSectionTitle>
            {t('next_reward')}
            <StyledSubtitle>{t('rebase_countdown', { countdown })}</StyledSubtitle>
          </StyledSectionTitle>
          <StyledSectionBody>
            <StyledClamBalanceContainer>
              <StyledClamBalance>{trim(nextReward, 4)} CLAM</StyledClamBalance>
            </StyledClamBalanceContainer>
            <StyledInfos>
              <StyledInfoContainer>
                <StyledInfoTitle>{t('next_reward_yield')}</StyledInfoTitle>
                <p>{trim(nextRewardRate * 100, 4)}%</p>
              </StyledInfoContainer>
              <StyledInfoContainer>
                <StyledInfoTitle>{t('apy')}</StyledInfoTitle>
                <p>{trim(apy, 2)}%</p>
              </StyledInfoContainer>
              <StyledInfoContainer>
                <p />
                <StyledPearlChestContainer>
                  <StyledPearlChest>
                    {t('chest_reward')}
                    <span>+ 86%</span>
                  </StyledPearlChest>
                </StyledPearlChestContainer>
              </StyledInfoContainer>
            </StyledInfos>
            <StyledExtraRewards>{t('extra_rewards')}</StyledExtraRewards>
            <StyledGashaponTicket />
          </StyledSectionBody>
        </StyledSection>
      </StyledBody>
    </StyledStakeInfo>
  )
}
