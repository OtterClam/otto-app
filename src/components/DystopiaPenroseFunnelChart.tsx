import format from 'date-fns/format'
import { trim } from 'helpers/trim'
import { i18n } from 'i18next'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef, useMemo } from 'react'
import { FunnelChart, Funnel, Tooltip, Legend, Cell, LabelList, Label } from 'recharts'
import styled from 'styled-components/macro'
import ChartTooltip from './ChartTooltip'
import { GetGovernanceMetrics_governanceMetrics, GetGovernanceMetrics } from 'graphs/__generated__/GetGovernanceMetrics'

const StyledContainer = styled.div`
  font-family: 'Pangolin', 'naikaifont' !important;
`
export interface DystopiaPenroseFunnelChartProps {
  metrics: GetGovernanceMetrics_governanceMetrics[]
}

interface ChartItem {
  key: any
  label: any
  value: string
  color: string
}

const localFunnel = [
  {
    label: 'Dyst',
    dataKey: 'dystTotalSupply',
    color: 'rgba(15, 99, 55, 0.5)',
    value: 0,
  },
  {
    label: 'veDyst',
    dataKey: 'veDystTotalSupply',
    color: 'rgba(190, 55, 55, 0.5)',
    value: 0,
  },
  {
    label: 'penDyst',
    dataKey: 'penDystTotalSupply',
    color: 'rgba(200, 55, 55, 0.5)',
    value: 0,
  },
  {
    label: 'vlPen',
    dataKey: 'vlPenTotalSupply',
    color: 'rgba(210, 55, 55, 0.5)',
    value: 0,
  },
  {
    label: 'OC vlPen',
    dataKey: 'otterClamVlPenTotalOwned',
    color: 'rgba(219, 55, 55, 0.5)',
    value: 0,
  },
]

const renderTooltip: (i18nClient: i18n) => TooltipRenderer =
  i18n =>
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

  type MetricsKey = keyof typeof metrics[0]

  //Map data from metrics object to Recharts-friendly dictionary
  var data = localFunnel
  for (let i = 0; i < data.length; i++) {
    data[i].value = parseFloat(metrics[0][data[i].dataKey as MetricsKey])
  }

  if (data.length == 0) return null

  return (
    <StyledContainer ref={containerRef}>
      <FunnelChart width={900} height={260}>
        <Funnel data={data} nameKey="label" dataKey="value" fill="color" labelLine={true} isAnimationActive={false}>
          {/* <LabelList style={{ zIndex: 1 }} height={500} width={500} position="right" dataKey="label" fill="#00FF00" /> */}
          <LabelList position="right" fill="#000" stroke="none" dataKey="label"></LabelList>
        </Funnel>
        <Tooltip wrapperStyle={{ zIndex: 1, fontSize: '12px !important' }} content={renderTooltip(i18n) as any} />
      </FunnelChart>
    </StyledContainer>
  )
}
