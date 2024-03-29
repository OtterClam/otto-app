import ChartXAxis from 'components/ChartXAxis'
import ChartYAxis from 'components/ChartYAxis'
import format from 'date-fns/format'
import { GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
import { AggregatedMetrics } from 'hooks/useCrossChainTreasuryMetrics'
import useSize from 'hooks/useSize'
import { i18n } from 'i18next'
import { useTranslation } from 'next-i18next'
import { RefObject, useRef } from 'react'
import { Area, AreaChart, Tooltip } from 'recharts'
import styled from 'styled-components/macro'
import { theme } from 'styles'
import { formatUsd } from 'utils/currency'
import ChartTooltip from './ChartTooltip'

const StyledContainer = styled.div`
  height: 260px;
  width: 100%;
`

const xAxisTickProps = { fontSize: '12px' }
const yAxisTickProps = { fontSize: '12px' }

const formatCurrency = (c: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c)
}

const ytickFormatter = (number: string) => `${formatCurrency(parseFloat(number) / 1000000)}M`

export const marketValues = [
  {
    label: 'Total',
    dataKey: 'treasuryMarketValue',
    stopColor: theme.colors.treasury.clamLpRed,
  },
  {
    label: 'CLAM/USD+ (Penrose)',
    dataKey: 'treasuryDystopiaPairUSDPLUSClamMarketValue',
    stopColor: theme.colors.treasury.clamLpRed,
  },
  {
    label: 'CLAM/USDC (Penrose)',
    dataKey: 'treasuryDystopiaPairUsdcClamMarketValue',
    stopColor: ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
  },
  {
    label: 'CLAM/MAI (Quick)',
    dataKey: 'treasuryClamMaiMarketValue',
    stopColor: theme.colors.treasury.clamLpRed,
  },
  {
    label: 'CLAM/MAI (Penrose)',
    dataKey: 'treasuryDystopiaPairMaiClamMarketValue',
    stopColor: theme.colors.treasury.clamLpRed,
  },
  {
    label: 'MATIC',
    dataKey: 'treasuryWmaticMarketValue',
    stopColor: ['#2891F9', 'rgba(40, 145, 249, 0.5)'],
  },
  {
    label: 'MAI/USDC (QiDAO)',
    dataKey: 'treasuryMaiUsdcQiInvestmentValue',
    stopColor: theme.colors.treasury.stablecoinGreen,
  },
  {
    label: 'MAI/USDC (UniV3)',
    dataKey: 'treasuryUniV3UsdcMaiStrategyMarketValue',
    stopColor: theme.colors.treasury.stablecoinGreen,
  },
  {
    label: 'MAI/USDT (QuickV3)',
    dataKey: 'treasuryQuickswapV3MaiUsdtStrategyMarketValue',
    stopColor: ['#5CBD6B', 'rgba(92, 189, 107, 0.5)'],
  },
  {
    label: 'USDC/MAI (Arrakis)',
    dataKey: 'treasuryArrakisUsdcMaiMarketValue',
    stopColor: theme.colors.treasury.stablecoinGreen,
  },
  {
    label: 'USD+',
    dataKey: 'treasuryUsdPlusMarketValue',
    stopColor: ['rgba(72, 229, 8, 1)', 'rgba(72, 229, 8, 0.5)'],
  },
  {
    label: 'USD+/USDC (Penrose)',
    dataKey: 'treasuryDystopiaPairUsdplusUsdcMarketValue',
    stopColor: ['rgba(182, 233, 152, 1)', 'rgba(182, 233, 152, 0.5)'],
  },
  {
    label: 'DAI (Gains)',
    dataKey: 'treasuryDaiMarketValue',
    stopColor: theme.colors.treasury.gainsDai,
  },
  {
    label: 'TUSD/USDC (Penrose)',
    dataKey: 'treasuryDystopiaPairUsdcTusdMarketValue',
    stopColor: ['rgba(182, 233, 152, 1)', 'rgba(182, 233, 152, 0.5)'],
  },
  {
    label: 'stMATIC/USD+ (Penrose)',
    dataKey: 'treasuryDystopiaPairUsdplusStMaticMarketValue',
    stopColor: theme.colors.treasury.maticPurple,
  },
  {
    label: 'stMATIC/MAI (QiDAO)',
    dataKey: 'treasuryMaiStMaticMarketValue',
    stopColor: theme.colors.treasury.maticPurple,
  },
  {
    label: 'Hedged USDC/MATIC (Penrose)',
    dataKey: 'treasuryPenroseHedgedMaticMarketValue',
    stopColor: theme.colors.treasury.maticPurple,
  },
  {
    label: 'Hedged MATIC/stMATIC (Kyberswap)',
    dataKey: 'treasuryKyberswapMaticStMaticHedgedMarketValue',
    stopColor: theme.colors.treasury.maticPurple,
  },
  {
    label: 'Hedged MATIC/USDC (UniV3)',
    dataKey: 'treasuryUniV3HedgedMaticUsdcStrategyMarketValue',
    stopColor: theme.colors.treasury.maticPurple,
  },

  {
    label: 'Qi',
    dataKey: 'treasuryQiMarketValue',
    stopColor: theme.colors.treasury.qiYellow,
  },
  {
    label: 'Qi (Locked)',
    dataKey: 'treasuryOtterClamQiMarketValue',
    stopColor: theme.colors.treasury.qiYellow,
  },
  {
    label: 'dQUICK',
    dataKey: 'treasuryDquickMarketValue',
    stopColor: ['#5C80B6', 'rgba(92, 128, 182, 0.5)'],
  },
  {
    label: 'Qi/MATIC',
    dataKey: 'treasuryQiWmaticQiInvestmentMarketValue',
    stopColor: theme.colors.treasury.qiYellow,
  },
  {
    label: 'Qi/TetuQi (Penrose)',
    dataKey: 'treasuryDystopiaPairQiTetuQiMarketValue',
    stopColor: ['#CC48E1', 'rgba(244, 210, 88, 0.5)'],
  },
  {
    label: 'DAI',
    dataKey: 'treasuryDaiRiskFreeValue',
    stopColor: theme.colors.treasury.qiYellow,
  },
  {
    label: 'TetuQi',
    dataKey: 'treasuryTetuQiMarketValue',
    stopColor: ['#CC48E1', '#EA94FF'],
  },
  {
    label: 'DYST',
    dataKey: 'treasuryDystMarketValue',
    stopColor: ['rgba(8, 95, 142, 1)', 'rgba(8, 95, 142, 0.5)'],
  },
  {
    label: 'veDYST',
    dataKey: 'treasuryVeDystMarketValue',
    stopColor: ['rgba(8, 95, 142, 1)', 'rgba(8, 95, 142, 0.5)'],
  },
  {
    label: 'PEN',
    dataKey: 'treasuryPenMarketValue',
    stopColor: ['rgba(108, 111, 227, 1)', 'rgba(252, 236, 255, 0.8)'],
  },
  {
    label: 'vlPEN',
    dataKey: 'treasuryVlPenMarketValue',
    stopColor: ['rgba(108, 111, 227, 1)', 'rgba(252, 236, 255, 0.8)'],
  },
  {
    label: 'penDYST',
    dataKey: 'treasuryPenDystMarketValue',
    stopColor: theme.colors.treasury.penDyst,
  },
  {
    label: 'MATIC/DYST (Penrose)',
    dataKey: 'treasuryDystopiaPairwMaticDystMarketValue',
    stopColor: ['rgba(182, 233, 152, 1)', 'rgba(182, 233, 152, 0.5)'],
  },
  {
    label: 'MAI/USDC (Penrose)',
    dataKey: 'treasuryDystopiaPairMaiUsdcMarketValue',
    stopColor: ['rgba(182, 233, 152, 1)', 'rgba(182, 233, 152, 0.5)'],
  },
  {
    label: 'FRAX/USDC (Penrose)',
    dataKey: 'treasuryDystopiaPairFraxUsdcMarketValue',
    stopColor: ['rgba(182, 233, 152, 1)', 'rgba(182, 233, 152, 0.5)'],
  },
  {
    label: 'SAND',
    dataKey: 'treasurySandMarketValue',
    stopColor: ['rgba(0, 174, 239, 1)', 'rgba(0, 174, 239, 0.5)'],
  },
  {
    label: 'CLAM',
    dataKey: 'treasuryClamValue',
    stopColor: ['rgba(255, 172, 161, 1)', 'rgba(255, 172, 161, 0.5)'],
  },
  {
    label: 'OHM',
    dataKey: 'treasuryOHMStrategyMarketValue',
    stopColor: ['#676B74', 'rgba(103, 107, 116, 0.5)'],
  },
  // {
  //   label: 'wMEMO',
  //   dataKey: 'treasuryWMEMOStrategyMarketValue',
  //   stopColor: ['#121415', 'rgba(18,20,21,0.5)'],
  // },
  {
    label: 'USDC (AVAX)',
    dataKey: 'avaxUsdcMarketValue',
    stopColor: ['#121415', 'rgba(18,20,21,0.5)'],
  },
  {
    label: 'wMEMO (AVAX)',
    dataKey: 'avaxWMemoMarketValue',
    stopColor: ['#121415', 'rgba(18,20,21,0.5)'],
  },

  {
    label: 'BUSD/USDC (Thena)',
    dataKey: 'bscThenaPairBusdUsdcMarketValue',
    stopColor: ['rgba(249,206,49,1)', 'rgba(249,206,49,0.5)'],
  },
]

const keySettingMap = marketValues.reduce(
  (map, setting) =>
    Object.assign(map, {
      [setting.dataKey]: setting,
    }),
  {} as { [k: string]: typeof marketValues[0] }
)

export interface TreasuryMarketValueChartProps {
  data: AggregatedMetrics[]
}

const renderTooltip: (i18nClient: i18n) => TooltipRenderer =
  i18n =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload
      .filter(({ value }) => Math.round(value) > 10)
      .map(({ name, value }) => ({
        key: name,
        label: keySettingMap[name].label,
        value: formatUsd(value),
        color: keySettingMap[name].stopColor[0],
      }))
    const footer = format(parseInt(payload[0]?.payload?.timestamp ?? '0', 10) * 1000, 'LLL d, yyyy')
    const headerLabel = i18n.t('treasury.dashboard.chartHeaderLabel')
    return (
      <ChartTooltip
        headerLabel={headerLabel}
        headerValue={formatUsd(payload[0]?.payload?.treasuryMarketValue)}
        items={items}
        footer={footer}
      />
    )
  }

export default function TreasuryMarketValueChart({ data }: TreasuryMarketValueChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)
  return (
    <StyledContainer ref={containerRef}>
      <AreaChart data={data} width={size?.width} height={size?.height}>
        <defs>
          {marketValues.map(({ dataKey: key, stopColor }) => (
            <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stopColor[0]} stopOpacity={1} />
              <stop offset="90%" stopColor={stopColor[1]} stopOpacity={1} />
            </linearGradient>
          ))}
        </defs>
        <ChartXAxis
          dataKey="timestamp"
          interval={30}
          axisLine={false}
          tick={xAxisTickProps}
          tickLine={false}
          tickFormatter={(val: number) => format(new Date(val * 1000), 'MMM dd')}
          reversed
          connectNulls
          padding={{ right: 20 }}
        />
        <ChartYAxis
          tickCount={2}
          interval="preserveStartEnd"
          axisLine={false}
          tickLine={false}
          width={33}
          tick={yAxisTickProps}
          tickFormatter={(num: string) => ytickFormatter(num)}
          connectNulls
          allowDataOverflow={false}
        />
        <Tooltip wrapperStyle={{ zIndex: 1 }} content={renderTooltip(i18n) as any} />
        {marketValues
          .filter(({ label }) => label !== 'Total')
          .map(({ dataKey, label }) => (
            <Area
              key={dataKey}
              stroke="none"
              dataKey={dataKey}
              label={label}
              fill={`url(#color-${dataKey})`}
              fillOpacity="1"
              stackId="1"
            />
          ))}
      </AreaChart>
    </StyledContainer>
  )
}
