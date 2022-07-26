import format from 'date-fns/format'
import { GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
import { trim } from 'helpers/trim'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import { i18n } from 'i18next'
import React, { RefObject, useRef } from 'react'
import { AreaChart, Area, Tooltip } from 'recharts'
import styled from 'styled-components/macro'
import ChartXAxis from 'components/ChartXAxis'
import ChartYAxis from 'components/ChartYAxis'
import ChartTooltip from './ChartTooltip'

const StyledContainer = styled.div`
  height: 260px;
  width: 100%;
`

const xAxisTickProps = { fontSize: '12px' }
const yAxisTickProps = { fontSize: '12px' }
const tickCount = 3

const formatCurrency = (c: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c)
}

const ytickFormatter = (number: string) => `${formatCurrency(parseFloat(number) / 1000000)}M`

const marketValues = [
  {
    label: 'Total',
    dataKey: 'treasuryMarketValue',
    stopColor: ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
  },
  {
    label: 'CLAM/USD+ (Penrose)',
    dataKey: 'treasuryDystopiaPairUSDPLUSClamMarketValue',
    stopColor: ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
  },
  {
    label: 'CLAM/MAI (Quick)',
    dataKey: 'treasuryClamMaiMarketValue',
    stopColor: ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
  },
  {
    label: 'CLAM/MAI (Penrose)',
    dataKey: 'treasuryDystopiaPairMaiClamMarketValue',
    stopColor: ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
  },
  {
    label: 'FRAX',
    dataKey: 'treasuryFraxMarketValue',
    stopColor: ['#8F5AE8', 'rgba(143, 90, 232, 0.5)'],
  },
  {
    label: 'MATIC',
    dataKey: 'treasuryWmaticMarketValue',
    stopColor: ['#2891F9', 'rgba(40, 145, 249, 0.5)'],
  },
  {
    label: 'MAI/USDC (QiDAO)',
    dataKey: 'treasuryMaiUsdcQiInvestmentValue',
    stopColor: ['#5CBD6B', 'rgba(92, 189, 107, 0.5)'],
  },
  {
    label: 'MAI/USDC',
    dataKey: 'treasuryMaiUsdcMarketValue',
    stopColor: ['#5CBD6B', 'rgba(92, 189, 107, 0.5)'],
  },
  {
    label: 'Qi',
    dataKey: 'treasuryQiMarketValue',
    stopColor: ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
  },
  {
    label: 'Qi(Locked)',
    dataKey: 'treasuryOtterClamQiMarketValue',
    stopColor: ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
  },
  {
    label: 'dQUICK',
    dataKey: 'treasuryDquickMarketValue',
    stopColor: ['#5C80B6', 'rgba(92, 128, 182, 0.5)'],
  },
  {
    label: 'Qi/MATIC',
    dataKey: 'treasuryQiWmaticQiInvestmentMarketValue',
    stopColor: ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
  },
  {
    label: 'Qi/TetuQi (Penrose)',
    dataKey: 'treasuryDystopiaPairQiTetuQiMarketValue',
    stopColor: ['#CC48E1', 'rgba(244, 210, 88, 0.5)'],
  },
  {
    label: 'DAI',
    dataKey: 'treasuryDaiRiskFreeValue',
    stopColor: ['#F4D258', 'rgba(244, 210, 88, 0.5)'],
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
    stopColor: ['rgba(108, 111, 227, 1)', 'rgba(8, 95, 142, 0.5)'],
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
]

const keySettingMap = marketValues.reduce(
  (map, setting) =>
    Object.assign(map, {
      [setting.dataKey]: setting,
    }),
  {} as { [k: string]: typeof marketValues[0] }
)

export interface TreasuryMarketValueChartProps {
  data: GetTreasuryMetrics_protocolMetrics[]
}

const renderTooltip: (i18nClient: i18n) => TooltipRenderer =
  i18n =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload
      .filter(({ value }) => Math.round(value) > 0)
      .map(({ name, value }) => ({
        key: name,
        label: keySettingMap[name].label,
        value: `$${Math.round(value).toLocaleString(i18n.language)}`,
        color: keySettingMap[name].stopColor[0],
      }))
    const footer = format(parseInt(payload[0]?.payload?.timestamp ?? '0', 10) * 1000, 'LLL d, yyyy')
    const headerLabel = i18n.t('treasury.dashboard.chartHeaderLabel')
    return (
      <ChartTooltip
        headerLabel={headerLabel}
        headerValue={`$${trim(payload[0]?.payload?.treasuryMarketValue, 0)}`}
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
      <AreaChart data={data} width={size?.width ?? 300} height={size?.height ?? 260}>
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
          ticks={[0, 3000000]}
          axisLine={false}
          tickLine={false}
          width={33}
          tick={yAxisTickProps}
          tickFormatter={(num: string) => ytickFormatter(num)}
          domain={[0, 'auto']}
          connectNulls
          allowDataOverflow={false}
        />
        <Tooltip
          wrapperStyle={{ zIndex: 1 }}
          formatter={(value: string) => trim(parseFloat(value), 2)}
          content={renderTooltip(i18n) as any}
        />
        {marketValues
          .filter(({ label }) => label != 'Total')
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
