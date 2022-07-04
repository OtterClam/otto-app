import format from 'date-fns/format'
import { trim } from 'helpers/trim'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef } from 'react'
import { BarChart, Tooltip, Bar } from 'recharts'
import { i18n } from 'i18next'
import styled from 'styled-components/macro'
import ChartXAxis from 'components/ChartXAxis'
import ChartYAxis from 'components/ChartYAxis'
import { GetTreasuryRevenue_treasuryRevenues } from 'graphs/__generated__/GetTreasuryRevenue'
import ChartTooltip from './ChartTooltip'

const StyledContainer = styled.div`
  height: 260px;
  width: 100%;
  overflow: hidden;
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

const formatClam = (number: string) => `${trim(parseFloat(number) / 1000, 2)}k`

const formatUsd = (number: string) => `${formatCurrency(parseFloat(number) / 1000)}k`

export enum Currency {
  CLAM = 'clam',
  USD = 'usd',
}

const dataKeysSettings = {
  [Currency.CLAM]: [
    { dataKey: 'totalRevenueClamAmount', colors: [], label: '' },
    { dataKey: 'qiClamAmount', colors: ['rgba(244, 210, 88, 1)', 'rgba(244, 210, 88, 0.5)'], label: 'Qi' },
    { dataKey: 'ottopiaClamAmount', colors: ['rgba(255, 172, 161, 1)', 'rgba(255, 172, 161, 0.5)'], label: 'CLAM' },
    { dataKey: 'dystClamAmount', colors: ['rgba(8, 95, 142, 0.6)', 'rgba(8, 95, 142, 0.3)'], label: 'DYST' },
    { dataKey: 'penClamAmount', colors: ['rgba(128, 131, 235, 0.8)', 'rgba(252, 236, 255, 0.5)'], label: 'PEN' },
  ],
  [Currency.USD]: [
    { dataKey: 'totalRevenueMarketValue', colors: [], label: '' },
    { dataKey: 'qiMarketValue', colors: ['rgba(244, 210, 88, 1)', 'rgba(244, 210, 88, 0.5)'], label: 'Qi' },
    { dataKey: 'ottopiaMarketValue', colors: ['rgba(255, 172, 161, 1)', 'rgba(255, 172, 161, 0.5)'], label: 'CLAM' },
    { dataKey: 'dystMarketValue', colors: ['rgba(8, 95, 142, 0.6)', 'rgba(8, 95, 142, 0.3)'], label: 'DYST' },
    { dataKey: 'penMarketValue', colors: ['rgba(128, 131, 235, 0.8)', 'rgba(252, 236, 255, 0.5)'], label: 'PEN' },
  ],
}

const settingsToMap = (settings: typeof dataKeysSettings[Currency.CLAM]) => {
  return settings.reduce(
    (map, setting) =>
      Object.assign(map, {
        [setting.dataKey]: setting,
      }),
    {} as { [k: string]: typeof settings[0] }
  )
}

const keySettingMap = {
  ...settingsToMap(dataKeysSettings[Currency.CLAM]),
  ...settingsToMap(dataKeysSettings[Currency.USD]),
}

export interface TreasuryRevenueChartProps {
  data: GetTreasuryRevenue_treasuryRevenues[]
  currency?: Currency
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
        color: (keySettingMap[name].colors ?? [])[0],
      }))
    const footer = format(parseInt(payload[0]?.payload?.timestamp ?? '0', 10) * 1000, 'LLL d, yyyy')
    const headerLabel = i18n.t('treasury.dashboard.chartHeaderLabel')
    return (
      <ChartTooltip headerLabel={headerLabel} headerValue={items[0].value} items={items.slice(1)} footer={footer} />
    )
  }

export default function TreasuryRevenueChart({ data, currency = Currency.USD }: TreasuryRevenueChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)
  const settings = dataKeysSettings[currency]

  return (
    <StyledContainer ref={containerRef}>
      <BarChart data={data} width={size?.width ?? 300} height={size?.height ?? 260}>
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
          tickFormatter={(num: string) => (currency === Currency.CLAM ? formatClam(num) : formatUsd(num))}
          domain={[0, (dataMax: number) => dataMax / 3]}
          connectNulls
          allowDataOverflow
        />
        <Tooltip
          wrapperStyle={{ zIndex: 1 }}
          formatter={(value: string) => trim(parseFloat(value), 2)}
          content={renderTooltip(i18n) as any}
        />
        {settings.map(({ dataKey: key, colors }, i) => {
          console.log(colors)
          // Don't fill area for Total (avoid double-counting)
          if (key === 'totalRevenueMarketValue' || key === 'totalRevenueClamAmount') {
            return <Bar key={i} dataKey={key} stackId="-1" fillOpacity={0} />
          }
          return <Bar key={i} dataKey={key} stroke={colors[0]} fill={colors[0]} fillOpacity={1} stackId="1" />
        })}
      </BarChart>
    </StyledContainer>
  )
}
