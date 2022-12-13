import format from 'date-fns/format'
import { format as formatDate } from 'date-fns'
import { Investments_investments } from 'graphs/__generated__/Investments'
import useSize from 'hooks/useSize'
import { i18n } from 'i18next'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef } from 'react'
import { PieChart, Pie, Tooltip, Cell, Label } from 'recharts'
import styled from 'styled-components/macro'
import { theme } from 'styles'
import { formatUsd } from 'utils/currency'
import ChartTooltip from './ChartTooltip'

const StyledContainer = styled.div`
  height: 260px;
  width: 100%;
`
export interface TreasuryMarketValueChartProps {
  data: Investments_investments[]
  tmv: number
  date: number
}

const renderTooltip: (i18nClient: i18n) => TooltipRenderer =
  i18n =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload
      .filter(({ value }) => Math.round(value) > 10)
      .map(({ name, value, payload }) => ({
        key: payload.dataKey,
        label: name,
        value: formatUsd(value),
        color: payload.stopColor,
      }))
    const footer = format(parseInt(payload[0]?.payload?.timestamp ?? '0', 10) * 1000, 'LLL d, yyyy')
    // formatUsd(payload[0]?.value
    return <ChartTooltip headerLabel="Market Value" items={items} footer={footer} />
  }

export default function TreasuryMarketValuePieChart({ data, tmv, date }: TreasuryMarketValueChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)

  let pieData = []
  for (let index = data.length - 1; index > 0; index--) {
    const element = data[index]
    const uid = `${element.protocol}_${element.strategy}`
    if (!pieData?.map(x => x.uid).includes(uid) && parseInt(element.timestamp, 10) === date) {
      pieData.push({
        uid,
        nav: parseFloat(element.netAssetValue),
        label: element.strategy,
        stopColor: '',
        timestamp: element.timestamp,
      })
    }
  }

  pieData = pieData.sort((a, b) => b.nav - a.nav)
  pieData.forEach((val, index) => {
    const colorVals = Object.values(theme.colors.rarity)
    val.stopColor = colorVals[index % colorVals.length]
  })

  // add untracked value to pie chart
  const trackedVal = tmv - pieData.reduce((curr, next) => curr + next.nav, 0)
  pieData.push({
    uid: 'Untracked',
    nav: trackedVal,
    label: 'Untracked',
    stopColor: 'gray',
    timestamp: date,
  })

  return (
    <StyledContainer ref={containerRef}>
      <PieChart width={size?.width} height={size?.height}>
        <Tooltip wrapperStyle={{ zIndex: 1 }} content={renderTooltip(i18n) as any} />

        <Pie data={pieData} nameKey="label" outerRadius={120} innerRadius={70} dataKey="nav" minAngle={3}>
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.stopColor} />
          ))}
          <Label
            content={props => {
              const {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                viewBox: { cx, cy },
              } = props
              const positioningProps = {
                x: cx,
                y: cy,
                textAnchor: 'middle',
                verticalAnchor: 'middle',
              }
              const positioningPropsTwo = {
                x: cx - 40,
                y: cy + 20,
              }
              return (
                <>
                  <text {...positioningProps} style={{ fontSize: '24px', fill: 'white' }}>
                    {formatUsd(tmv)}
                  </text>
                  <text {...positioningPropsTwo} style={{ fill: 'white' }}>
                    {formatDate(date * 1000, 'yyyy-M-d')}
                  </text>
                </>
              )
            }}
          />
        </Pie>
      </PieChart>
    </StyledContainer>
  )
}
