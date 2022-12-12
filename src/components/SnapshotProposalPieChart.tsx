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
import { Colors } from '../styles/colors'
import { GovernanceTab } from '../models/Tabs'

const StyledContainer = styled.div`
  font-family: 'Pangolin', 'naikaifont' !important;
  height: fit-content;
  width: fit-content;
  float: left;
`
export interface SnapshotProposalPieChartProps {
  proposal: Proposal
  tab: GovernanceTab
}

const COLORS = ['#0088FE', '#FFBB28', '#00C49F', '#FF8042']

const renderTooltip: (i18nClient: i18n, tab: GovernanceTab) => TooltipRenderer =
  (i18n, tab) =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload.map(({ name, value, payload }) => ({
      key: name,
      label: name,
      value: `${Math.round(value).toLocaleString(i18n.language)} ${i18n.t('treasury.governance.votes')}`,
      color: COLORS[payload.colorId % COLORS.length],
    }))
    const isOuterRing = payload?.[0].dataKey === 'power'
    const msg = tab === GovernanceTab.OTTERCLAM ? 'youVoted' : 'ocvoted'
    return <ChartTooltip headerLabel={isOuterRing ? i18n.t(`treasury.governance.${msg}`) : ''} items={items} />
  }

export default function SnapshotProposalPieChart({ proposal, tab }: SnapshotProposalPieChartProps) {
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
  if (data.length === 0) return null

  // sort values and figure out colours
  data = data.sort((a, b) => b.score - a.score)
  data.forEach((val, index) => (val.colorId = index))
  // Also map the voted choices
  const votes: any[] = []
  if (proposal.voted) {
    const totalWeight = Object.values(proposal.voted_choices)
      .map(Number)
      .reduce((a, b) => a + b, 0)

    if (proposal.type === 'single-choice' || proposal.type === 'basic') {
      const choiceId = parseInt(proposal.voted_choices, 10) - 1
      votes.push({
        choiceId,
        choice: proposal.choices?.[choiceId],
        weight: 1,
        power: proposal.vote_power,
        colorId: data.findIndex(x => x.choiceId === choiceId),
      })
    }
    if (proposal.type === 'weighted') {
      for (let i = 0; i < Object.keys(proposal.voted_choices).length; i++) {
        const choiceId = parseInt(Object.keys(proposal.voted_choices)[i], 10) - 1 // vote index starts at 1
        const weight = proposal.voted_choices[Object.keys(proposal.voted_choices)[i]]

        votes.push({
          choiceId,
          choice: proposal.choices?.[choiceId],
          weight,
          power: (weight / totalWeight) * (proposal.vote_power ?? 1),
          colorId: data.findIndex(x => x.choiceId === choiceId),
        })
      }
    }
  }

  return (
    <StyledContainer ref={containerRef}>
      <PieChart width={300} height={250}>
        <Tooltip wrapperStyle={{ zIndex: 1, fontSize: '12px !important' }} content={renderTooltip(i18n, tab) as any} />
        <Pie data={data} labelLine={false} nameKey="choice" outerRadius={80} dataKey="score" minAngle={3}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.colorId % COLORS.length]} />
          ))}
        </Pie>
        {proposal.voted && (
          <Pie
            data={votes}
            labelLine={false}
            nameKey="choice"
            innerRadius={90}
            outerRadius={100}
            dataKey="power"
            minAngle={5}
          >
            {votes.map((entry, index) => (
              <Cell key={`cell-outer-${index}`} fill={COLORS[entry.colorId % COLORS.length]} />
            ))}
          </Pie>
        )}

        <Legend
          fontFamily="Pangolin"
          style={{ fontFamily: 'Pangolin !important', overflow: 'scroll' }}
          payload={
            proposal.voted
              ? votes.map((entry, index) => ({
                  id: index.toString(),
                  value: entry.choice,
                  color: COLORS[entry.colorId % COLORS.length],
                }))
              : data.map((entry, index) => ({
                  id: index.toString(),
                  value: entry.choice,
                  color: COLORS[entry.colorId % COLORS.length],
                }))
          }
        />
      </PieChart>
    </StyledContainer>
  )
}
