import format from 'date-fns/format'
import { trim } from 'helpers/trim'
import { i18n } from 'i18next'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef, useMemo } from 'react'
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts'
import styled from 'styled-components/macro'
import ChartTooltip from './ChartTooltip'
import { Proposal } from '../models/Proposal'

const StyledContainer = styled.div`
  font-family: 'Pangolin', 'naikaifont' !important;
`
export interface SnapshotProposalPieChartProps {
  proposal: Proposal
  outerLegendOnly?: boolean
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const renderTooltip: (i18nClient: i18n) => TooltipRenderer =
  i18n =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload.map(({ name, value, choiceId }) => ({
      key: name,
      label: name,
      value: `${Math.round(value).toLocaleString(i18n.language)} ${i18n.t('treasury.governance.votes')}`,
      color: COLORS[choiceId % COLORS.length],
    }))

    // const footer = format(parseInt(payload[0]?.payload?.start ?? '0', 10) * 1000, 'LLL d, yyyy')
    return <ChartTooltip items={items} /> // footer={footer}headerColor={items}
  }

export default function SnapshotProposalPieChart({ proposal, outerLegendOnly = false }: SnapshotProposalPieChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)

  // Map data from proposal object to Recharts-friendly dictionary
  let data: any[] = []
  for (let i = 0; i < proposal.choices.length; i++) {
    if (proposal.scores?.[i] !== undefined && proposal.scores?.[i] !== 0) {
      data.push({
        choiceId: i,
        choice: proposal.choices?.[i],
        score: proposal.scores?.[i],
      })
    }
  }

  // Also map the DAO-voted choices
  const dao_votes: any[] = []
  if (proposal.voted) {
    const totalWeight = Object.values(proposal.voted_choices)
      .map(Number)
      .reduce((a, b) => a + b, 0)

    if (proposal.type === 'single-choice') {
      const choiceId = parseInt(proposal.voted_choices, 10) - 1
      dao_votes.push({
        choiceId,
        choice: proposal.choices?.[choiceId],
        weight: 1,
        power: proposal.vote_power,
      })
    }
    if (proposal.type === 'weighted') {
      for (let i = 0; i < Object.keys(proposal.voted_choices).length; i++) {
        const choiceId = parseInt(Object.keys(proposal.voted_choices)[i], 10) - 1 // vote index starts at 1
        const weight = proposal.voted_choices[Object.keys(proposal.voted_choices)[i]]

        dao_votes.push({
          choiceId,
          choice: proposal.choices?.[choiceId],
          weight,
          power: (weight / totalWeight) * (proposal.vote_power ?? 1),
        })
      }
    }
  }
  if (data.length === 0) return null

  data = data.sort((a, b) => b.score - a.score)

  return (
    <StyledContainer ref={containerRef}>
      <PieChart width={size?.width ?? 300} height={260}>
        <Tooltip wrapperStyle={{ zIndex: 1, fontSize: '12px !important' }} content={renderTooltip(i18n) as any} />
        <Pie data={data} labelLine={false} nameKey="choice" outerRadius={80} dataKey="score" minAngle={3}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {proposal.voted ? (
          <Pie
            data={dao_votes}
            labelLine={false}
            nameKey="choice"
            innerRadius={90}
            outerRadius={100}
            dataKey="power"
            minAngle={5}
          >
            {dao_votes.map((entry, index) => (
              <Cell key={`cell-outer-${index}`} fill={COLORS[entry.choiceId % COLORS.length]} />
            ))}
          </Pie>
        ) : null}

        {outerLegendOnly ? (
          <Legend
            fontFamily="Pangolin"
            style={{ fontFamily: 'Pangolin !important', overflow: 'scroll' }}
            height={36}
            payload={dao_votes.map((entry, index) => ({
              id: index.toString(),
              value: entry.choice,
              color: COLORS[entry.choiceId % COLORS.length],
            }))}
          />
        ) : (
          <Legend
            fontFamily="Pangolin"
            style={{ fontFamily: 'Pangolin !important', overflow: 'scroll' }}
            height={36}
            payload={data.map((entry, index) => ({
              id: index.toString(),
              value: entry.choice,
              color: COLORS[entry.choiceId % COLORS.length],
            }))}
          />
        )}
      </PieChart>
    </StyledContainer>
  )
}
