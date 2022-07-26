import { subDays, format as formatDate } from 'date-fns'
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
import { useMemo, useState } from 'react'
import useTreasuryRevenues from 'hooks/useTreasuryRevenues'
import usePearlBankMetrics from 'hooks/usePearlBankMetrics'
import ClamSupplyChart from 'components/ClamSupplyChart'
import ClamBuybackChart from 'components/ClamBuybackChart'
import CurrencySwitcher from 'components/CurrencySwitcher'
import useCurrencyFormatter from 'hooks/useCurrencyFormatter'
import { Currency } from 'contexts/Currency'
import Switcher from 'components/Switcher'
import Leaves from './leaves.png'
import Shell from './shell.png'
import Bird from './bird.png'
import Turtle from './turtle.png'

const TreasuryMarketValueChart = dynamic(() => import('components/TreasuryMarketValueChart'))
const TreasuryRevenuesChart = dynamic(() => import('components/TreasuryRevenuesChart'))
const BankAvgAprChart = dynamic(() => import('components/BankAvgAprChart'))

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
  min-width: 0;
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
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
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

const StyledChartKeyValue = styled.span`
  display: flex;
  align-items: center;
`

const StyledChartKeyDate = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.darkGray200};
  margin-left: 6px;
`

const formatFinancialNumber = (num: BigNumberish, decimal = 9, digits = 2) =>
  `$${formatBigNumber(num, decimal, digits)}`

const formatBigNumber = (num: BigNumberish, decimal = 9, digits = 2) => {
  try {
    return trim(ethers.utils.formatUnits(num, decimal), digits)
  } catch {
    return ''
  }
}

export enum PearlBankAvgAprRange {
  Week = 7,
  Month = 30,
}

const usePearlBankApr = () => {
  const [range, setRange] = useState(PearlBankAvgAprRange.Week)
  const { metrics: pearlBankMetrics } = usePearlBankMetrics()
  const startDate = useMemo(
    () => subDays(Number(pearlBankMetrics[0]?.timestamp ?? 0) * 1000, range),
    [range, pearlBankMetrics]
  )
  const metricsSlice = pearlBankMetrics.slice(0, range)
  const avgApr = useMemo(() => {
    const totalSum = metricsSlice.reduce((total, value) => {
      return total + parseFloat(value.apr)
    }, 0)

    const average = totalSum / metricsSlice.length

    return trim(average, 1)
  }, [range, pearlBankMetrics])

  return {
    avgApr,
    startDate,
    pearlBankAvgAprRange: range,
    setPearlBankAvgAprRange: setRange,
  }
}

export default function TreasuryDashboardPage() {
  const { t } = useTranslation('', { keyPrefix: 'treasury.dashboard' })
  const { metrics, latestMetrics } = useTreasuryMetrics()
  const { metrics: pearlBankMetrics, latestMetrics: pearlBankLatestMetrics } = usePearlBankMetrics()
  const { revenues } = useTreasuryRevenues()
  const { clamPrice } = useTreasuryRealtimeMetrics()
  const { avgApr, pearlBankAvgAprRange, setPearlBankAvgAprRange } = usePearlBankApr()
  const pearlBankAvgAprRangeStartDate = subDays(new Date(), pearlBankAvgAprRange)

  const getRevenue = useCurrencyFormatter({
    formatters: {
      [Currency.CLAM]: () =>
        `${formatBigNumber(ethers.utils.parseUnits(revenues[0]?.totalRevenueClamAmount ?? '0', 32), 32, 0)} CLAM`,
      [Currency.USD]: () =>
        formatFinancialNumber(ethers.utils.parseUnits(revenues[0]?.totalRevenueMarketValue ?? '0', 32), 32, 0),
    },
    defaultCurrency: Currency.CLAM,
  })

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
            <Help message={t('burnedTooltip')}>
              <ContentExtraSmall>{t('burned')}</ContentExtraSmall>
            </Help>
            <ContentMedium>
              {trim(latestMetrics?.totalBurnedClam, 0)}
              {`🔥($${trim(latestMetrics?.totalBurnedClamMarketValue, 2)})`}
            </ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('distributedTooltip')}>
              <ContentExtraSmall>{t('distributed')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{trim(pearlBankLatestMetrics?.cumulativeRewardPayoutMarketValue, 0)} USD+</ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('backingTooltip')}>
              <ContentExtraSmall>{t('backing')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{'$' + trim(latestMetrics?.clamBacking, 2)}</ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('tvdTooltip')}>
              <ContentExtraSmall>{t('tvd')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{`$${trim(pearlBankLatestMetrics?.totalClamStakedUsdValue, 0)}`}</ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('clamCirculatingSupplyTooltip')}>
              <ContentExtraSmall>{t('clamCirculatingSupply')}</ContentExtraSmall>
            </Help>
            <ContentMedium>
              {trim(latestMetrics?.clamCirculatingSupply, 0)} /
              {formatBigNumber(ethers.utils.parseUnits(latestMetrics?.totalSupply ?? '0', 27), 27, 0)}
            </ContentMedium>
          </StyledTreasuryCard>
        </StyledMetricsContainer>
      </TreasurySection>

      <TreasurySection showRope={false}>
        <StyledChartsContainer>
          <StyledChartCard>
            <StyledChartHeader>
              <StyledChartTitle>{t('treasuryMarketValue')}</StyledChartTitle>
              <StyledChartKeyValue>
                {formatFinancialNumber(ethers.utils.parseUnits(latestMetrics?.treasuryMarketValue ?? '0', 27), 27, 0)}
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
              </StyledChartKeyValue>
            </StyledChartHeader>
            <TreasuryMarketValueChart data={metrics} />
          </StyledChartCard>

          <StyledChartCard>
            <StyledChartHeader>
              <StyledChartTitle>{t('treasuryRevenue')}</StyledChartTitle>
              <StyledChartKeyValue>
                {getRevenue()}
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
                <CurrencySwitcher />
              </StyledChartKeyValue>
            </StyledChartHeader>
            <TreasuryRevenuesChart data={revenues} />
          </StyledChartCard>

          <StyledChartCard>
            <StyledChartHeader>
              <StyledChartTitle>{t('averageApr')}</StyledChartTitle>
              <StyledChartKeyValue>
                {avgApr ?? 0}%
                <StyledChartKeyDate>
                  {t('averageAprStartDate', { date: formatDate(pearlBankAvgAprRangeStartDate, 'MMM d') })}
                </StyledChartKeyDate>
                <Switcher
                  name="pearl-bank-avg-apr-range"
                  value={pearlBankAvgAprRange}
                  onChange={setPearlBankAvgAprRange}
                  options={[
                    { label: 'Week', value: PearlBankAvgAprRange.Week },
                    { label: 'Month', value: PearlBankAvgAprRange.Month },
                  ]}
                />
              </StyledChartKeyValue>
            </StyledChartHeader>
            <BankAvgAprChart data={pearlBankMetrics} aprRange={pearlBankAvgAprRange} />
          </StyledChartCard>

          <StyledChartCard>
            <StyledChartHeader>
              <StyledChartTitle>{t('treasuryRevenue')}</StyledChartTitle>
              <StyledChartKeyValue>
                {getRevenue()}
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
                <CurrencySwitcher />
              </StyledChartKeyValue>
            </StyledChartHeader>
            <TreasuryRevenuesChart data={revenues} />
          </StyledChartCard>
        </StyledChartsContainer>
      </TreasurySection>
    </div>
  )
}
