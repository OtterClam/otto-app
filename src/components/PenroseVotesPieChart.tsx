import format from 'date-fns/format'
import { trim } from 'helpers/trim'
import { i18n } from 'i18next'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef, useMemo } from 'react'
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts'
import styled from 'styled-components/macro'
import { GetPenroseVotes_votePosition_votes } from 'graphs/__generated__/GetPenroseVotes'
import ChartTooltip from './ChartTooltip'

const StyledContainer = styled.div`
  font-family: 'Pangolin', 'naikaifont' !important;
`
export interface PenroseVotesPieChartProps {
  votes: GetPenroseVotes_votePosition_votes[]
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const renderTooltip: (i18nClient: i18n, index: number) => TooltipRenderer =
  (i18n, index) =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload.map(({ name, value }) => ({
      key: name,
      label: name,
      value: `${Math.round(value).toLocaleString(i18n.language)} vlPEN`,
      color: COLORS[index],
    }))
    // const footer = format(parseInt(payload[0]?.payload?.start ?? '0', 10) * 1000, 'LLL d, yyyy')
    return <ChartTooltip items={items} /> // footer={footer}
  }

export default function PenroseVotesPieChart({ votes }: PenroseVotesPieChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)

  // Map data from proposal object to Recharts-friendly dictionary
  let data: any[] = []
  for (let i = 0; i < votes.length; i++) {
    if (votes[i].vote >= 1) {
      data.push({ choice: votes[i].id, score: parseFloat(votes[i].vote) })
    }
  }

  if (data.length === 0) return null
  data = data.sort((a, b) => b.score - a.score)

  return (
    <StyledContainer ref={containerRef}>
      <PieChart width={size?.width ?? 300} height={260}>
        <Tooltip wrapperStyle={{ zIndex: 1, fontSize: '12px !important' }} content={renderTooltip(i18n, 0) as any} />
        <Pie data={data} labelLine={false} nameKey="choice" outerRadius={80} dataKey="score" minAngle={5}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend fontFamily="Pangolin" style={{ fontFamily: 'Pangolin !important' }} />
      </PieChart>
    </StyledContainer>
  )
}
