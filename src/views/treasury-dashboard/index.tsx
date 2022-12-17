import { subDays, format as formatDate } from 'date-fns'
import dynamic from 'next/dynamic'
import AdBanner from 'components/AdBanner'
import TreasuryCard from 'components/TreasuryCard'
import TreasurySection from 'components/TreasurySection'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentExtraSmall, ContentMedium, ContentSmall } from 'styles/typography'
import ClamIcon from 'assets/clam.png'
import Help from 'components/Help'
import useTreasuryMetrics from 'hooks/useTreasuryMetrics'
import useAvaxTreasuryMarketValues from 'hooks/useAvaxTreasuryMarketValues'
import { trim } from 'helpers/trim'
import { useMemo, useState } from 'react'
import useTreasuryRevenues from 'hooks/useTreasuryRevenues'
import usePearlBankMetrics from 'hooks/usePearlBankMetrics'
import CurrencySwitcher from 'components/CurrencySwitcher'
import { Currency, useCurrency } from 'contexts/Currency'
import Switcher from 'components/Switcher'
import { formatClamString, formatUsd } from 'utils/currency'
import { GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
import { GetAvaxTreasuryMetrics_avaxTreasuryMarketValues } from 'graphs/__generated__/GetAvaxTreasuryMetrics'
import Head from 'next/head'
import Leaves from './leaves.png'
import Shell from './shell.png'
import Bird from './bird.png'
import Turtle from './turtle.png'

const TreasuryMarketValueChart = dynamic(() => import('components/TreasuryMarketValueChart'))
const TreasuryRevenuesChart = dynamic(() => import('components/TreasuryRevenuesChart'))
const BankAvgAprChart = dynamic(() => import('components/BankAvgAprChart'))
const StakedClamChart = dynamic(() => import('components/StakedClamChart'))

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
  width: 100%;
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

const StyledChartsContainer = styled(ContentMedium).attrs({ as: 'div' })`
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

const StyledChartHeaderHorizontalList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-evenly;
  align-items: baseline;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
  }
`

const StyledChartHeaderHorizontalListItem = styled.li`
  list-style: none;
  display: flex;
  align-items: baseline;

  &::before {
    /* Unicode for a bullet */
    content: '\\2022';
    font-size: 26px;
    width: 0.5em;
  }

  &:nth-child(1):before {
    color: rgba(108, 111, 227, 1);
  }

  &:nth-child(2):before {
    color: rgba(255, 172, 161, 1);
  }
`
const StyledTopBar = styled.div`
  display: inline-flex;
  justify-content: space-between;
`
export enum PearlBankAvgAprRange {
  Week = 7,
  Month = 30,
  ThreeMonth = 90,
}

const usePearlBankApr = () => {
  const [range, setRange] = useState(PearlBankAvgAprRange.Week)
  const { metrics: pearlBankMetrics } = usePearlBankMetrics()
  const startDate = useMemo(() => {
    const pastDayFromRange = subDays(Number(pearlBankMetrics[0]?.timestamp ?? 0) * 1000, range - 1)
    const oldestDataDate = new Date((pearlBankMetrics[pearlBankMetrics.length - 1]?.timestamp ?? 0) * 1000)

    return pastDayFromRange > oldestDataDate ? pastDayFromRange : oldestDataDate
  }, [range, pearlBankMetrics])
  const avgApr = useMemo(() => {
    const metricsSlice = pearlBankMetrics.slice(0, range)
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

export interface AggregatedMetrics
  extends Omit<GetTreasuryMetrics_protocolMetrics, '__typename'>,
    Omit<GetAvaxTreasuryMetrics_avaxTreasuryMarketValues, '__typename'> {}

export default function TreasuryDashboardPage() {
  const { t } = useTranslation('', { keyPrefix: 'treasury.dashboard' })
  const { loading, metrics, latestMetrics } = useTreasuryMetrics()
  const { metrics: avaxMetrics } = useAvaxTreasuryMarketValues()
  const {
    loading: pearlBankLoading,
    metrics: pearlBankMetrics,
    latestMetrics: pearlBankLatestMetrics,
  } = usePearlBankMetrics()
  const { loading: revenuesLoading, revenues, latestRevenues } = useTreasuryRevenues()
  const {
    avgApr,
    startDate: pearlBankAvgAprRangeStartDate,
    pearlBankAvgAprRange,
    setPearlBankAvgAprRange,
  } = usePearlBankApr()

  const { currency } = useCurrency()

  const pctBurnt = trim(
    (parseFloat(latestMetrics?.totalBurnedClam) /
      (parseFloat(latestMetrics?.totalSupply) + parseFloat(latestMetrics?.totalBurnedClam))) *
      100,
    2
  )

  const allTimeAvgApr = useMemo(
    () =>
      pearlBankMetrics.reduce((total, value) => {
        return total + parseFloat(value.apr)
      }, 0) / pearlBankMetrics.length,
    [pearlBankMetrics]
  )

  // Aggregate Cross-Chain metrics
  const aggregatedMetrics = useMemo(
    () =>
      metrics?.map(x => {
        const matchAvax = avaxMetrics?.find(a => a.id === x.id)
        console.log(matchAvax)
        const backingWithoutClam =
          parseFloat(x.treasuryMarketValueWithoutClam) + parseFloat(matchAvax?.avaxTotalMarketValue ?? '0')

        // TODO: Key settings map?
        return {
          id: x.id,
          treasuryMarketValue: parseFloat(x.treasuryMarketValue) + parseFloat(matchAvax?.avaxTotalMarketValue ?? '0'),
          treasuryMarketValueWithoutClam: backingWithoutClam,
          clamBacking: backingWithoutClam / parseInt(x.clamCirculatingSupply, 10),

          avaxTotalMarketValue: matchAvax?.avaxTotalMarketValue,
          avaxUsdcMarketValue: matchAvax?.avaxUsdcMarketValue,
          avaxWMemoMarketValue: matchAvax?.avaxWMemoMarketValue,
          clamCirculatingSupply: x.clamCirculatingSupply,
          clamPrice: x.clamPrice,
          marketCap: x.marketCap,
          timestamp: x.timestamp,
          totalBurnedClam: x.totalBurnedClam,
          totalBurnedClamMarketValue: x.totalBurnedClamMarketValue,
          totalSupply: x.totalSupply,
          treasuryClamMaiMarketValue: x.treasuryClamMaiMarketValue,
          treasuryClamValue: x.treasuryClamValue,
          treasuryDaiMarketValue: x.treasuryDaiMarketValue,
          treasuryDystMarketValue: x.treasuryDystMarketValue,
          treasuryDystopiaPairMaiClamMarketValue: x.treasuryDystopiaPairMaiClamMarketValue,
          treasuryDystopiaPairQiTetuQiMarketValue: x.treasuryDystopiaPairQiTetuQiMarketValue,
          treasuryDystopiaPairUSDPLUSClamMarketValue: x.treasuryDystopiaPairUSDPLUSClamMarketValue,
          treasuryDystopiaPairUsdcClamMarketValue: x.treasuryDystopiaPairUsdcClamMarketValue,
          treasuryDystopiaPairUsdcTusdMarketValue: x.treasuryDystopiaPairUsdcTusdMarketValue,
          treasuryDystopiaPairUsdplusStMaticMarketValue: x.treasuryDystopiaPairUsdplusStMaticMarketValue,
          treasuryDystopiaPairUsdplusUsdcMarketValue: x.treasuryDystopiaPairUsdplusUsdcMarketValue,
          treasuryDystopiaPairwMaticDystMarketValue: x.treasuryDystopiaPairwMaticDystMarketValue,
          treasuryKyberswapMaticStMaticHedgedMarketValue: x.treasuryKyberswapMaticStMaticHedgedMarketValue,
          treasuryMaiStMaticMarketValue: x.treasuryMaiStMaticMarketValue,
          treasuryMaiUsdcQiInvestmentValue: x.treasuryMaiUsdcQiInvestmentValue,
          treasuryOHMStrategyMarketValue: x.treasuryOHMStrategyMarketValue,
          treasuryOtterClamQiMarketValue: x.treasuryOtterClamQiMarketValue,
          treasuryPenDystMarketValue: x.treasuryPenDystMarketValue,
          treasuryPenMarketValue: x.treasuryPenMarketValue,
          treasuryPenroseHedgedMaticMarketValue: x.treasuryPenroseHedgedMaticMarketValue,
          treasuryQiMarketValue: x.treasuryQiMarketValue,
          treasuryQiWmaticMarketValue: x.treasuryQiWmaticMarketValue,
          treasuryQiWmaticQiInvestmentMarketValue: x.treasuryQiWmaticQiInvestmentMarketValue,
          treasuryQuickswapV3MaiUsdtStrategyMarketValue: x.treasuryQuickswapV3MaiUsdtStrategyMarketValue,
          treasurySandMarketValue: x.treasurySandMarketValue,
          treasuryTetuQiMarketValue: x.treasuryTetuQiMarketValue,
          treasuryUniV3HedgedMaticUsdcStrategyMarketValue: x.treasuryUniV3HedgedMaticUsdcStrategyMarketValue,
          treasuryUniV3UsdcMaiStrategyMarketValue: x.treasuryUniV3UsdcMaiStrategyMarketValue,
          treasuryUsdPlusMarketValue: x.treasuryUsdPlusMarketValue,
          treasuryVeDystMarketValue: x.treasuryVeDystMarketValue,
          treasuryVlPenMarketValue: x.treasuryVlPenMarketValue,
          treasuryWMEMOStrategyMarketValue: x.treasuryWMEMOStrategyMarketValue, // now unused
          treasuryWmaticMarketValue: x.treasuryWmaticMarketValue,
        } as AggregatedMetrics
      }),
    [metrics, avaxMetrics]
  )

  const latestAggregatedMetric = aggregatedMetrics[0]
  return (
    <div>
      <Head>
        <title>{t('docTitle')}</title>
        <meta property="og:title" content={t('docTitle')} />
        <meta name="description" content={t('docDesc')} />
        <meta property="og:description" content={t('docDesc')} />
        <meta property="og:image" content="/og.jpg" />
      </Head>
      <TreasurySection>
        <AdBanner />
      </TreasurySection>
      <TreasurySection>
        <StyledMetricsContainer>
          <StyledTreasuryCard>
            <StyledTokenContainer>
              <StyledTokenLabel>{t('clamPrice')}</StyledTokenLabel>
              <StyledTokenPrice>{loading ? '--' : formatUsd(latestAggregatedMetric?.clamPrice, 2)}</StyledTokenPrice>
              <StyledTokenIcon src={ClamIcon.src} />
            </StyledTokenContainer>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('marketcapTooltip')}>
              <ContentExtraSmall>{t('marketcap')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{loading ? '--' : formatUsd(latestAggregatedMetric?.marketCap)}</ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('clamCirculatingSupplyTooltip')}>
              <ContentExtraSmall>{t('clamCirculatingSupply')}</ContentExtraSmall>
            </Help>
            <ContentMedium>
              {loading ? '--' : formatClamString(latestAggregatedMetric?.clamCirculatingSupply)} /
              {loading ? '--' : formatClamString(latestAggregatedMetric?.totalSupply)}
            </ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('backingTooltip')}>
              <ContentExtraSmall>{t('backing')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{loading ? '--' : formatUsd(latestAggregatedMetric?.clamBacking, 2)}</ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('burnedTooltip')}>
              <ContentExtraSmall>{t('burned')}</ContentExtraSmall>
            </Help>
            <ContentMedium>
              {loading ? '--' : formatClamString(latestAggregatedMetric?.totalBurnedClam)}
              {` 🔥 ${loading ? '--' : formatUsd(latestAggregatedMetric?.totalBurnedClamMarketValue)}`}
              {` 🔥 ${loading ? '--' : pctBurnt}%`}
            </ContentMedium>
          </StyledTreasuryCard>

          <StyledTreasuryCard>
            <Help message={t('distributedTooltip')}>
              <ContentExtraSmall>{t('distributed')}</ContentExtraSmall>
            </Help>
            <ContentMedium>
              {pearlBankLoading ? '--' : formatUsd(pearlBankLatestMetrics?.cumulativeRewardPayoutMarketValue)} @{' '}
              {pearlBankLoading ? '--' : trim(allTimeAvgApr, 1)}% APR
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
                {pearlBankLoading ? '--' : formatUsd(latestAggregatedMetric?.treasuryMarketValue)}
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
              </StyledChartKeyValue>
            </StyledChartHeader>
            <TreasuryMarketValueChart data={aggregatedMetrics} />
          </StyledChartCard>

          <StyledChartCard>
            <StyledChartHeader>
              <StyledTopBar>
                <Help message={t('treasuryRevenueTooltip')}>
                  <StyledChartTitle> {t('treasuryRevenue')} </StyledChartTitle>
                </Help>
                <CurrencySwitcher />
              </StyledTopBar>
              <StyledChartKeyValue>
                {currency === Currency.CLAM
                  ? `${revenuesLoading ? '--' : formatClamString(latestRevenues?.totalRevenueClamAmount, true)}`
                  : `${revenuesLoading ? '--' : formatUsd(latestRevenues?.totalRevenueMarketValue)}`}
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
              </StyledChartKeyValue>
            </StyledChartHeader>
            <TreasuryRevenuesChart data={revenues} />
          </StyledChartCard>

          <StyledChartCard>
            <StyledChartHeader>
              <StyledTopBar>
                <Help message={t('rewardsTooltip')}>
                  <StyledChartTitle>{t('averageApr')}</StyledChartTitle>
                </Help>
                <Switcher
                  name="pearl-bank-avg-apr-range"
                  value={pearlBankAvgAprRange}
                  onChange={setPearlBankAvgAprRange}
                  options={[
                    { label: 'Week', value: PearlBankAvgAprRange.Week },
                    { label: 'Month', value: PearlBankAvgAprRange.Month },
                    { label: '3 Months', value: PearlBankAvgAprRange.ThreeMonth },
                  ]}
                />
              </StyledTopBar>
              <StyledChartKeyValue>
                {avgApr ?? 0}%
                <StyledChartKeyDate>
                  {t('averageAprStartDate', { date: formatDate(pearlBankAvgAprRangeStartDate, 'MMM d') })}
                </StyledChartKeyDate>
              </StyledChartKeyValue>
            </StyledChartHeader>
            <BankAvgAprChart data={pearlBankMetrics} aprRange={pearlBankAvgAprRange} />
          </StyledChartCard>

          <StyledChartCard>
            <StyledChartHeader>
              <StyledTopBar>
                <Help message={t('tvdTooltip')}>
                  {' '}
                  <StyledChartTitle>{t('tvd')}</StyledChartTitle>{' '}
                </Help>
                <CurrencySwitcher />
              </StyledTopBar>
              <StyledChartHeaderHorizontalList>
                <StyledChartHeaderHorizontalListItem>
                  <StyledChartKeyValue>{`${trim(
                    ((pearlBankLatestMetrics?.pearlBankDepositedClamAmount ?? 0) /
                      (latestMetrics?.clamCirculatingSupply ?? 1)) *
                      100,
                    1
                  )}%`}</StyledChartKeyValue>
                  <StyledChartKeyDate>{t('stakedChartHeader')}</StyledChartKeyDate>
                </StyledChartHeaderHorizontalListItem>
                <StyledChartHeaderHorizontalListItem>
                  <StyledChartKeyValue>{`${trim(
                    ((pearlBankLatestMetrics?.clamPondDepositedClamAmount ?? 0) /
                      (latestMetrics?.clamCirculatingSupply ?? 1)) *
                      100,
                    1
                  )}%`}</StyledChartKeyValue>
                  <StyledChartKeyDate>{t('autocompoundChartHeader')}</StyledChartKeyDate>
                </StyledChartHeaderHorizontalListItem>
              </StyledChartHeaderHorizontalList>
            </StyledChartHeader>
            <StakedClamChart data={pearlBankMetrics} />
          </StyledChartCard>
        </StyledChartsContainer>
      </TreasurySection>
    </div>
  )
}
