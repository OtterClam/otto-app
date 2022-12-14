import { PearlBankAvgAprRange } from 'views/treasury-dashboard'
import format from 'date-fns/format'
import { trim } from 'helpers/trim'
import { ethers } from 'ethers'
import { GetPearlBankMetrics_pearlBankMetrics } from 'graphs/__generated__/GetPearlBankMetrics'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import { i18n } from 'i18next'
import React, { RefObject, useRef, useMemo } from 'react'
import { AreaChart, Area, Tooltip, BarChart, Bar } from 'recharts'
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

const ytickFormatter = (number: string) =>
  parseFloat(number) < 1000 ? `${Math.round(parseFloat(number))}%` : `${Math.round(parseFloat(number) / 1000)}k%`

const displayedFields = [
  {
    label: 'APY',
    dataKey: 'apy',
    stopColor: ['rgba(255, 172, 161, 1)', 'rgba(255, 172, 161, 0.5)'],
  },
  {
    label: 'APR',
    dataKey: 'apr',
    stopColor: ['rgba(108, 111, 227, 1)', 'rgba(8, 95, 142, 0.5)'],
  },
  {
    label: 'Reward Rate',
    dataKey: 'rewardRate',
    stopColor: ['#5CBD6B', 'rgba(92, 189, 107, 0.5)'],
  },
]

const keySettingMap = displayedFields.reduce(
  (map, setting) =>
    Object.assign(map, {
      [setting.dataKey]: setting,
    }),
  {} as { [k: string]: typeof displayedFields[0] }
)

export interface BankAvgAprChartProps {
  data: GetPearlBankMetrics_pearlBankMetrics[]
  aprRange: PearlBankAvgAprRange
}

const renderTooltip: (i18nClient: i18n) => TooltipRenderer =
  i18n =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload.map(({ name, value }) => ({
      key: name,
      label: keySettingMap[name].label,
      value: `${parseFloat(parseFloat(value).toFixed(name === 'rewardRate' ? 3 : 1)).toLocaleString(i18n.language)}%`,
      color: keySettingMap[name].stopColor[0],
    }))

    const footer = format(parseInt(payload[0]?.payload?.timestamp ?? '0', 10) * 1000, 'LLL d, yyyy')
    const headerLabel = i18n.t('treasury.dashboard.dailyPayout')

    return items.length > 0 ? <ChartTooltip headerLabel={headerLabel} items={items} footer={footer} /> : null
  }

export default function BankAvgAprChart({ data, aprRange }: BankAvgAprChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)

  const slicedData = data.slice(0, aprRange)
  return (
    <StyledContainer ref={containerRef}>
      <BarChart data={slicedData} width={size?.width ?? 300} height={size?.height ?? 260}>
        <defs>
          {displayedFields.map(({ dataKey: key, stopColor }) => (
            <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stopColor[0]} stopOpacity={1} />
              <stop offset="100%" stopColor={stopColor[1]} stopOpacity={1} />
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
          tickCount={tickCount}
          axisLine={false}
          tickLine={false}
          width={40}
          tick={yAxisTickProps}
          tickFormatter={(num: string) => ytickFormatter(num)}
          domain={[0, (dataMax: number) => (dataMax < 175 ? (dataMax * 1.1).toPrecision(2) : 175)]}
          connectNulls
          allowDataOverflow={false}
        />
        <Tooltip wrapperStyle={{ zIndex: 1 }} content={renderTooltip(i18n) as any} />
        {displayedFields.map(({ dataKey, label }, i) => (
          <Bar
            key={dataKey}
            stroke={`url(#color-${dataKey})`}
            dataKey={dataKey}
            label={label}
            fill={`url(#color-${dataKey})`}
            fillOpacity="1"
            stackId={i}
            minPointSize={3}
          />
        ))}
      </BarChart>
    </StyledContainer>
  )
}
