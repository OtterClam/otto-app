import ChartXAxis from 'components/ChartXAxis'
import ChartYAxis from 'components/ChartYAxis'
import format from 'date-fns/format'
import { GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
import { Investments_investments } from 'graphs/__generated__/Investments'
import useSize from 'hooks/useSize'
import { i18n } from 'i18next'
import { useTranslation } from 'next-i18next'
import { RefObject, useRef } from 'react'
import { Area, ComposedChart, Tooltip } from 'recharts'
import styled from 'styled-components/macro'
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

const ytickFormatter = (number: string) => `${formatCurrency(parseFloat(number) / 1000)}K`

const investmentDataKeys = [
  {
    label: 'Net Asset Value',
    dataKey: 'netAssetValue',
    stopColor: ['#EE4B4E', 'rgba(219, 55, 55, 0.5)'],
  },
]

const keySettingMap = investmentDataKeys.reduce(
  (map, setting) =>
    Object.assign(map, {
      [setting.dataKey]: setting,
    }),
  {} as { [k: string]: typeof investmentDataKeys[0] }
)

export interface InvestmentsChartProps {
  data: Investments_investments[]
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
        headerValue={formatUsd(payload[0]?.payload?.investments)}
        items={items}
        footer={footer}
      />
    )
  }

export default function InvestmentsChart({ data }: InvestmentsChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)
  return (
    <StyledContainer ref={containerRef}>
      <ComposedChart data={data} width={size?.width} height={size?.height}>
        <defs>
          {investmentDataKeys.map(({ dataKey: key, stopColor }) => (
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
          connectNulls
          padding={{ right: 20 }}
        />
        <ChartYAxis
          tickCount={5}
          interval="preserveStartEnd"
          axisLine={false}
          tickLine={false}
          width={33}
          tick={yAxisTickProps}
          tickFormatter={(num: string) => ytickFormatter(num)}
          connectNulls
          allowDataOverflow={false}
          yAxisId="left"
        />
        <ChartYAxis
          tickCount={5}
          interval="preserveStartEnd"
          axisLine={false}
          tickLine={false}
          width={33}
          tick={yAxisTickProps}
          tickFormatter={(num: string) => ytickFormatter(num)}
          connectNulls
          allowDataOverflow={false}
          yAxisId="right"
          orientation="right"
        />
        <Tooltip wrapperStyle={{ zIndex: 1 }} content={renderTooltip(i18n) as any} />
        {investmentDataKeys
          // .filter(({ label }) => label !== 'Total')
          .map(({ dataKey, label }) => (
            <Area
              key={dataKey}
              stroke="none"
              dataKey={dataKey}
              label={label}
              fill={`url(#color-${dataKey})`}
              fillOpacity="1"
              stackId="1"
              yAxisId="left"
            />
          ))}
      </ComposedChart>
    </StyledContainer>
  )
}
