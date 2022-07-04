import format from 'date-fns/format'
import { GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
import { i18n } from 'i18next'
import { trim } from 'helpers/trim'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef } from 'react'
import { AreaChart, Area, Tooltip } from 'recharts'
import styled from 'styled-components/macro'
import ChartXAxis from 'components/ChartXAxis'
import ChartYAxis from 'components/ChartYAxis'
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

const formatUsd = (number: string) => `${formatCurrency(parseFloat(number) / 1000 / 1000)}m`

export enum Currency {
  CLAM = 'clam',
  USD = 'usd',
}

export interface ClamSupplyChartProps {
  data: GetTreasuryMetrics_protocolMetrics[]
  currency?: Currency
}

const renderTooltip: (i18nClient: i18n) => TooltipRenderer =
  i18n =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload.map(({ name, value }) => ({
      key: name,
      label: i18n.t('treasury.dashboard.clamCirculatingSupply'),
      value: `$${Math.round(value).toLocaleString(i18n.language)}`,
      color: '#FFACA1',
    }))
    const footer = format(parseInt(payload[0]?.payload?.timestamp ?? '0', 10) * 1000, 'LLL d, yyyy')
    return <ChartTooltip items={items} footer={footer} />
  }

export default function ClamSupplyChart({ data, currency = Currency.USD }: ClamSupplyChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)
  const dataKey = currency === Currency.USD ? 'marketCap' : 'clamCirculatingSupply'

  return (
    <StyledContainer ref={containerRef}>
      <AreaChart data={data} width={size?.width ?? 300} height={size?.height ?? 260}>
        <defs>
          <linearGradient id="color-clam-supply" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFACA1" stopOpacity={1} />
            <stop offset="90%" stopColor="rgba(255, 172, 161, 0.5)" stopOpacity={1} />
          </linearGradient>
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
          width={33}
          dx={3}
          tick={yAxisTickProps}
          tickFormatter={(num: string) => (currency === Currency.CLAM ? formatClam(num) : formatUsd(num))}
          connectNulls
          allowDataOverflow
          domain={[0, 'auto']}
        />
        <Tooltip
          wrapperStyle={{ zIndex: 1 }}
          formatter={(value: string) => trim(parseFloat(value), 2)}
          content={renderTooltip(i18n) as any}
        />
        <Area dataKey={dataKey} stroke="none" fill="url(#color-clam-supply)" fillOpacity={1} />
      </AreaChart>
    </StyledContainer>
  )
}
