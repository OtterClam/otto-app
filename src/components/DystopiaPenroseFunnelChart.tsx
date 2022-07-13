import format from 'date-fns/format'
import { trim } from 'helpers/trim'
import { i18n } from 'i18next'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef, useMemo } from 'react'
import { FunnelChart, Funnel, Tooltip, Legend, Cell, LabelList } from 'recharts'
import styled from 'styled-components/macro'
import ChartTooltip from './ChartTooltip'
import { GetGovernanceMetrics_governanceMetrics, GetGovernanceMetrics } from 'graphs/__generated__/GetGovernanceMetrics'

const StyledContainer = styled.div`
  font-family: 'Pangolin', 'naikaifont' !important;
`
export interface DystopiaPenroseFunnelChartProps {
  metrics: GetGovernanceMetrics_governanceMetrics[]
}

const localFunnel = [
  {
    label: 'Dyst',
    dataKey: 'dystTotalSupply',
    color: ['#000000', 'rgba(219, 55, 55, 0.5)'],
    value: 0,
  },
  {
    label: 'veDyst',
    dataKey: 'veDystTotalSupply',
    color: ['#00FF00', 'rgba(219, 55, 55, 0.5)'],
    value: 0,
  },
  {
    label: 'penDyst',
    dataKey: 'penDystTotalSupply',
    color: ['#FFFFFF', 'rgba(219, 55, 55, 0.5)'],
    value: 0,
  },
  {
    label: 'vlPen',
    dataKey: 'vlPenTotalSupply',
    color: ['#FFFFFF', 'rgba(219, 55, 55, 0.5)'],
    value: 0,
  },
  {
    label: 'OC vlPen',
    dataKey: 'otterClamVlPenTotalOwned',
    color: ['#FFFFFF', 'rgba(219, 55, 55, 0.5)'],
    value: 0,
  },
]

const renderTooltip: (i18nClient: i18n, index: number) => TooltipRenderer =
  (i18n, index) =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload.map(({ name, value }) => ({
      key: name,
      label: name,
      value: `$${Math.round(value).toLocaleString(i18n.language)}`,
      color: '#FFFFF',
    }))
    // const footer = format(parseInt(payload[0]?.payload?.start ?? '0', 10) * 1000, 'LLL d, yyyy')
    return <ChartTooltip items={items} /> //footer={footer}
  }

export default function DystopiaPenroseFunnelChart({ metrics }: DystopiaPenroseFunnelChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)

  type MetricsKey = keyof typeof metrics

  //Map data from metrics object to Recharts-friendly dictionary
  var data: any[] = localFunnel
  for (let i = 0; i < data.length; i++) {
    data[i].value = metrics[data[i].dataKey as MetricsKey]
  }

  if (data.length == 0) return null

  return (
    <StyledContainer ref={containerRef}>
      <FunnelChart width={size?.width ?? 300} height={260}>
        <Funnel data={data} nameKey="label" dataKey="value">
          <LabelList position="right" dataKey="label" fill="#000" stroke="none" />
        </Funnel>
        <Legend fontFamily="Pangolin" style={{ fontFamily: 'Pangolin !important' }} />
      </FunnelChart>
    </StyledContainer>
  )
}
