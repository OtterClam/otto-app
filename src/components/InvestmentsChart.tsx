import ChartXAxis from 'components/ChartXAxis'
import ChartYAxis from 'components/ChartYAxis'
import format from 'date-fns/format'
import { GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
import { Investments_investments } from 'graphs/__generated__/Investments'
import useSize from 'hooks/useSize'
import { i18n } from 'i18next'
import * as _ from 'lodash'
import { useTranslation } from 'next-i18next'
import { RefObject, useRef } from 'react'
import { Area, ComposedChart, Line, Tooltip } from 'recharts'
import styled from 'styled-components/macro'
import { formatUsd, formatUsdThousandsK } from 'utils/currency'
import ChartTooltip from './ChartTooltip'

const StyledContainer = styled.div`
  height: 260px;
  width: 100%;
`

const xAxisTickProps = { fontSize: '12px' }
const yAxisTickProps = { fontSize: '12px' }

export interface InvestmentsChartProps {
  data: Investments_investments[]
}

function tryFloat(x: string) {
  try {
    return parseFloat(x)
  } finally {
    return x
  }
}

const renderTooltip: (i18nClient: i18n) => TooltipRenderer =
  i18n =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }

    const nav = {
      key: 'netAssetValue',
      label: 'Market Value',
      value: formatUsd(payload[0]?.payload?.netAssetValue),
      color: '#EE4B4E',
    }
    const aprValue = parseFloat(payload[1]?.payload?.grossApr).toFixed(2) + '%'
    const apr = {
      key: 'grossApr',
      label: 'Gross APR',
      value: parseFloat(payload[1]?.payload?.grossApr).toFixed(2) + '%',
      color: 'rgba(0, 55, 55, 1)',
    }

    const footer = format(parseInt(payload[0]?.payload?.timestamp ?? '0', 10) * 1000, 'LLL d, yyyy')
    const headerLabel = 'Investment:' // i18n.t('treasury.dashboard.chartHeaderLabel')
    return <ChartTooltip headerLabel={headerLabel} headerValue={''} items={[nav, apr]} footer={footer} />
  }

export default function InvestmentsChart({ data }: InvestmentsChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)

  const numberData = data.flatMap(d => _.mapValues(d, parseFloat))
  return (
    <StyledContainer ref={containerRef}>
      <ComposedChart data={numberData} width={size?.width} height={size?.height}>
        <defs>
          <linearGradient key={'area'} id={`color-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={'#EE4B4E'} stopOpacity={1} />
            <stop offset="90%" stopColor={'rgba(219, 55, 55, 0.5)'} stopOpacity={1} />
          </linearGradient>
          <linearGradient key={'line'} id={`color-line`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={'rgba(0, 55, 55, 1)'} stopOpacity={1} />
            <stop offset="90%" stopColor={'rgba(0, 55, 55, 1)'} stopOpacity={1} />
          </linearGradient>
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
          tickFormatter={(num: string) => formatUsdThousandsK(num)}
          connectNulls
          allowDataOverflow={false}
          yAxisId="left"
        />
        <ChartYAxis
          tickCount={5}
          interval="preserveEnd"
          axisLine={false}
          tickLine={false}
          width={33}
          tick={yAxisTickProps}
          tickFormatter={(num: string) => parseInt(num) + '%'}
          connectNulls
          allowDataOverflow={false}
          yAxisId="right"
          orientation="right"
        />
        <Tooltip wrapperStyle={{ zIndex: 1 }} content={renderTooltip(i18n) as any} />

        <Area
          key={'netAssetValue'}
          stroke="none"
          dataKey={'netAssetValue'}
          label={'Net Asset Value'}
          fill={`url(#color-area)`}
          fillOpacity="1"
          stackId="1"
          yAxisId="left"
        />
        <Line
          key={'grossApr' + Math.random()} //All charts on page must have unique ID for Dots
          stroke={`url(#color-line)`}
          dataKey={'grossApr'}
          fill={`url(#color-line)`}
          yAxisId="right"
        />
      </ComposedChart>
    </StyledContainer>
  )
}
