import format from 'date-fns/format'
import { GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
import { trim } from 'helpers/trim'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef } from 'react'
import { BarChart, Area, Tooltip, Bar } from 'recharts'
import styled from 'styled-components/macro'
import ChartXAxis from 'components/ChartXAxis'
import ChartYAxis from 'components/ChartYAxis'
import { GetTreasuryRevenue_treasuryRevenues } from 'graphs/__generated__/GetTreasuryRevenue'

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

const formatClam = (number: string) => `${trim(parseFloat(number) / 1000, 2)}k`

const formatUsd = (number: string) => `${formatCurrency(parseFloat(number) / 1000)}k`

export enum Currency {
  CLAM = 'clam',
  USD = 'usd',
}

const dataKeysSettings = {
  [Currency.CLAM]: ['totalRevenueClamAmount', 'qiClamAmount', 'ottopiaClamAmount', 'dystClamAmount', 'penClamAmount'],
  [Currency.USD]: [
    'totalRevenueMarketValue',
    'qiMarketValue',
    'ottopiaMarketValue',
    'dystMarketValue',
    'penMarketValue',
  ],
}

export interface ClamMarketCapChartProps {
  data: GetTreasuryRevenue_treasuryRevenues[]
  currency?: Currency
}

export default function ClamMarketCapChart({ data, currency = Currency.CLAM }: ClamMarketCapChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t } = useTranslation()
  const size = useSize(containerRef)

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
        <Tooltip />
        {dataKeys.map((key, i) => {
          // Don't fill area for Total (avoid double-counting)
          if (key === 'totalRevenueMarketValue' || key === 'totalRevenueClamAmount') {
            return <Bar key={i} dataKey={key} stackId="-1" fillOpacity={0} />
          }
          return (
            <Bar key={i} dataKey={key} stroke={colors[i] as any} fill={colors[i] as any} fillOpacity={1} stackId="1" />
          )
        })}
      </BarChart>
    </StyledContainer>
  )
}
