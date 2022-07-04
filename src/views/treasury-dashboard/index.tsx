import dynamic from 'next/dynamic'
import AdBanner from 'components/AdBanner'
import TreasuryCard from 'components/TreasuryCard'
import TreasurySection from 'components/TreasurySection'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentExtraSmall, ContentMedium, ContentSmall } from 'styles/typography'
import ClamIcon from 'assets/clam.png'
import PearlIcon from 'assets/pearl.png'
import Help from 'components/Help'
import useTreasuryMetrics from 'hooks/useTreasuryMetrics'
import { useTreasuryRealtimeMetrics } from 'contracts/views'
import { trim } from 'helpers/trim'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { useMemo } from 'react'
import useTreasuryRevenues from 'hooks/useTreasuryRevenues'
import ClamSupplyChart from 'components/ClamSupplyChart'
import ClamBuybackChart from 'components/ClamBuybackChart'
import Leaves from './leaves.png'
import Shell from './shell.png'
import Bird from './bird.png'
import Turtle from './turtle.png'

const TreasuryMarketValueChart = dynamic(() => import('components/TreasuryMarketValueChart'))
const TreasuryRevenuesChart = dynamic(() => import('components/TreasuryRevenuesChart'))

const StyledMetricsContainer = styled.div`
  position: relative;
  margin: 24px 34px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;

  &::before {
    content: '';
    background: center / 77px 56px url(${Shell.src});
    position: absolute;
    top: -35px;
    right: -45px;
    width: 77px;
    height: 56px;
  }

  &::after {
    content: '';
    background: center / 105px 85px url(${Leaves.src});
    position: absolute;
    bottom: -24px;
    right: -35px;
    width: 105px;
    height: 85px;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: 1fr 1fr;
    grid-gap: 5px;
    margin: 5px;

    &::before {
      width: 51px;
      height: 37px;
      background-size: 51px 37px;
      right: -16px;
      top: -16px;
    }

    &::after {
      width: 70px;
      height: 57px;
      background-size: 70px 57px;
      right: -6px;
      bottom: -5px;
    }
  }
`

const StyledTreasuryCard = styled(TreasuryCard)`
  height: 80px;
  display: flex;
  flex-direction: column;
`

const StyledChartCard = styled(TreasuryCard)`
  min-height: 260px;
`

const StyledTokenContainer = styled.div`
  display: grid;
  grid-template-areas:
    'label icon'
    'price icon';
  grid-template-columns: 1fr 48px;
`

const StyledTokenLabel = styled(ContentExtraSmall)`
  grid-area: label;
`

const StyledTokenPrice = styled(ContentMedium)`
  grid-area: price;
`

const StyledTokenIcon = styled.img`
  grid-area: icon;
  width: 48px;
  height: 48px;
`

const StyledChartsContainer = styled(ContentMedium)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  margin: 24px 34px;

  &::before {
    content: '';
    z-index: 1;
    background: center / 94px 118px url(${Bird.src});
    position: absolute;
    top: -48px;
    left: -10px;
    width: 94px;
    height: 118px;
  }

  &::after {
    content: '';
    background: center / 126px 125px url(${Turtle.src});
    position: absolute;
    bottom: -35px;
    right: -25px;
    width: 126px;
    height: 125px;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: 1fr;
    grid-gap: 5px;
    margin: 5px;

    &::before {
      width: 63px;
      height: 79px;
      background-size: 63px 79px;
      right: -16px;
      top: -35px;
    }

    &::after {
      width: 84px;
      height: 83px;
      background-size: 84px 83px;
      right: -12px;
      bottom: -20px;
    }
  }
`

const StyledChartHeader = styled.h3`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`

const StyledChartTitle = styled(ContentSmall)`
  color: ${({ theme }) => theme.colors.darkGray200};
`

const StyledChartKeyValue = styled.span``

const StyledChartKeyDate = styled.span`
  color: ${({ theme }) => theme.colors.darkGray200};
  margin-left: 6px;
`

const formatFinancialNumber = (num: BigNumberish, decimal = 9) => `$${formatBigNumber(num, decimal)}`

const formatBigNumber = (num: BigNumberish, decimal = 9) => trim(ethers.utils.formatUnits(num, decimal), 2)

const formatNormalNumber = (num: number) => num.toFixed(2)

export default function TreasuryDashboardPage() {
  const { t } = useTranslation('', { keyPrefix: 'treasury.dashboard' })
  const { metrics, latestMetrics } = useTreasuryMetrics()
  const { revenues } = useTreasuryRevenues()
  const { clamPrice, pearlPrice, tvd, index } = useTreasuryRealtimeMetrics()
  const backing = ethers.utils
    .parseUnits(latestMetrics?.treasuryMarketValue ?? '0', 27)
    .div(ethers.utils.parseUnits(latestMetrics?.clamCirculatingSupply ?? '1', 9))
  const distributedAmount =
    metrics.length >= 2
      ? ethers.utils.parseUnits(metrics[0].totalSupply, 9).sub(ethers.utils.parseUnits(metrics[1].totalSupply, 9))
      : BigNumber.from(0)
  const distributedMarketValue = distributedAmount.mul(ethers.utils.parseUnits(metrics[0]?.clamPrice ?? '0', 33))

  const staked = useMemo(() => {
    return metrics
      .map((entry: any) => ({
        staked: (parseFloat(entry.sClamCirculatingSupply) / parseFloat(entry.clamCirculatingSupply)) * 100,
        timestamp: entry.timestamp,
      }))
      .filter((pm: any) => pm.staked < 100)
  }, [metrics])

  const transformedRevenues = useMemo(() => {
    return revenues.map(entry =>
      Object.entries(entry).reduce((obj, [key, value]) => {
        obj[key] = parseFloat(value)
        return obj
      }, {} as { [k: string]: number })
    )
  }, [revenues])

  return (
    <div>
      <TreasurySection>
        <AdBanner />
      </TreasurySection>
      <TreasurySection>
        <StyledMetricsContainer>
          <StyledTreasuryCard>
            <StyledTokenContainer>
              <StyledTokenLabel>{t('clamPrice')}</StyledTokenLabel>
              <StyledTokenPrice>{clamPrice ? formatFinancialNumber(clamPrice) : '--'}</StyledTokenPrice>
              <StyledTokenIcon src={ClamIcon.src} />
            </StyledTokenContainer>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <StyledTokenContainer>
              <StyledTokenLabel>{t('pearlPrice')}</StyledTokenLabel>
              <StyledTokenPrice>{pearlPrice ? formatFinancialNumber(pearlPrice, 18) : '--'}</StyledTokenPrice>
              <StyledTokenIcon src={PearlIcon.src} />
            </StyledTokenContainer>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('currentIndexTooltip')}>
              <ContentExtraSmall>{t('currentIndex')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{formatBigNumber(index)}</ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('backingTooltip')}>
              <ContentExtraSmall>{t('backing')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{formatBigNumber(backing, 18)}</ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('tvdTooltip')}>
              <ContentExtraSmall>{t('tvd')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{formatFinancialNumber(tvd, 18)}</ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('stakedTooltip')}>
              <ContentExtraSmall>{t('staked')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{formatNormalNumber(staked[0]?.staked ?? 0)}%</ContentMedium>
          </StyledTreasuryCard>
        </StyledMetricsContainer>
      </TreasurySection>

      <TreasurySection showRope={false}>
        <StyledChartsContainer>
          <StyledChartCard>
            <StyledChartHeader>
              <StyledChartTitle>{t('treasuryMarketValue')}</StyledChartTitle>
              <StyledChartKeyValue>
                {formatFinancialNumber(ethers.utils.parseUnits(latestMetrics?.treasuryMarketValue ?? '0', 27), 27)}
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
              </StyledChartKeyValue>
            </StyledChartHeader>
            <TreasuryMarketValueChart data={metrics} />
          </StyledChartCard>

          <StyledChartCard>
            <StyledChartHeader>
              <StyledChartTitle>{t('treasuryRevenue')}</StyledChartTitle>
              <StyledChartKeyValue>
                {formatFinancialNumber(ethers.utils.parseUnits(revenues[0]?.totalRevenueMarketValue ?? '0', 32), 32)}
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
              </StyledChartKeyValue>
            </StyledChartHeader>
            <TreasuryRevenuesChart data={revenues} />
          </StyledChartCard>

          <StyledChartCard>
            <StyledChartHeader>
              <StyledChartTitle>{t('clamCirculatingSupply')}</StyledChartTitle>
              <StyledChartKeyValue>
                {formatFinancialNumber(ethers.utils.parseUnits(latestMetrics?.clamCirculatingSupply ?? '0', 27), 27)} /
                ({formatFinancialNumber(ethers.utils.parseUnits(latestMetrics?.totalSupply ?? '0', 27), 27)})
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
              </StyledChartKeyValue>
            </StyledChartHeader>
            <ClamSupplyChart data={metrics} />
          </StyledChartCard>

          <StyledChartCard>
            <StyledChartHeader>
              <StyledChartTitle>{t('buybacks')}</StyledChartTitle>
              <StyledChartKeyValue>
                {formatFinancialNumber(ethers.utils.parseUnits(revenues[0]?.buybackMarketValue ?? '0', 32), 32)}
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
              </StyledChartKeyValue>
            </StyledChartHeader>
            <ClamBuybackChart data={revenues} />
          </StyledChartCard>

          <StyledTreasuryCard>
            <Help message={t('burnedTooltip')}>
              <ContentExtraSmall>{t('burned')}</ContentExtraSmall>
            </Help>
            <ContentMedium>
              {formatBigNumber(ethers.utils.parseUnits(latestMetrics?.totalBurnedClam ?? '0', 2), 2)} (
              {formatFinancialNumber(ethers.utils.parseUnits(latestMetrics?.totalBurnedClamMarketValue ?? '0', 29), 29)}
              )
            </ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('distributedTooltip')}>
              <ContentExtraSmall>{t('distributed')}</ContentExtraSmall>
            </Help>
            <ContentMedium>
              {formatFinancialNumber(distributedAmount, 9)} ({formatFinancialNumber(distributedMarketValue, 42)})
            </ContentMedium>
          </StyledTreasuryCard>
        </StyledChartsContainer>
      </TreasurySection>
    </div>
  )
}
