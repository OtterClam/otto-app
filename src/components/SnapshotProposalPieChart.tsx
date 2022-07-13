import format from 'date-fns/format'
import { trim } from 'helpers/trim'
import { i18n } from 'i18next'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef, useMemo } from 'react'
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts'
import styled from 'styled-components/macro'
import ChartTooltip from './ChartTooltip'
import { OtterClamProposals_proposals } from 'graphs/__generated__/OtterClamProposals'

const StyledContainer = styled.div`
  width: 100%;
`
export interface SnapshotProposalPieChartProps {
  proposal: OtterClamProposals_proposals
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const renderTooltip: (i18nClient: i18n) => TooltipRenderer =
  i18n =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload.map(({ name, value }) => ({
      key: name,
      label: name,
      value: `${Math.round(value).toLocaleString(i18n.language)} vPEARL`,
      color: COLORS[0],
    }))
    // const footer = format(parseInt(payload[0]?.payload?.start ?? '0', 10) * 1000, 'LLL d, yyyy')
    return <ChartTooltip items={items} /> //footer={footer}
  }

export default function SnapshotProposalPieChart({ proposal }: SnapshotProposalPieChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)

  //Map data from proposal object to Recharts-friendly dictionary
  var data: any[] = []
  for (let i = 0; i < proposal.choices.length; i++) {
    if (proposal.scores![i] == undefined || proposal.scores![i] == 0) continue
    data.push({ choice: proposal.choices![i], score: proposal.scores![i] })
  }

  if (data.length == 0) return null

  data = data.sort((a, b) => b.score - a.score)

  return (
    <StyledContainer ref={containerRef}>
      <PieChart width={size?.width ?? 300} height={260}>
        <Tooltip wrapperStyle={{ zIndex: 1, fontSize: '12px !important' }} content={renderTooltip(i18n) as any} />
        <Pie data={data} labelLine={false} nameKey="choice" outerRadius={80} dataKey="score" minAngle={5}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </StyledContainer>
  )
}
