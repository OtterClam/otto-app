import format from 'date-fns/format'
import { GetTreasuryMetrics_protocolMetrics } from 'graphs/__generated__/GetTreasuryMetrics'
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
import { marketValues } from './TreasuryMarketValueChart'

const StyledContainer = styled.div`
  height: 260px;
  width: 100%;
`

const formatCurrency = (c: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c)
}

const keySettingMap = marketValues.reduce(
  (map, setting) =>
    Object.assign(map, {
      [setting.dataKey]: setting,
    }),
  {} as { [k: string]: typeof marketValues[0] }
)

export interface TreasuryMarketValueChartProps {
  data: Investments_investments[]
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

export default function TreasuryMarketValuePieChart({ data }: TreasuryMarketValueChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)

  let pieData = []
  for (let index = data.length - 1; index > 0; index--) {
    const element = data[index]
    const uid = `${element.protocol}_${element.strategy}`
    if (!pieData?.map(x => x.uid).includes(uid)) {
      pieData.push({
        uid: uid,
        value: parseFloat(element.netAssetValue),
        label: element.strategy,
        dataKey: 'netAssetValue',
        stopColor: '',
        timestamp: element.timestamp,
      })
    }
  }

  pieData = pieData.sort((a, b) => b.value - a.value)
  pieData.forEach((val, index) => {
    const colorVals = Object.values(theme.colors.rarity)
    val.stopColor = colorVals[index % colorVals.length]
  })

  return (
    <StyledContainer ref={containerRef}>
      <PieChart width={size?.width} height={size?.height}>
        <Tooltip wrapperStyle={{ zIndex: 1 }} content={renderTooltip(i18n) as any} />

        <Pie
          data={pieData}
          labelLine={false}
          nameKey="label"
          outerRadius={120}
          innerRadius={70}
          dataKey="value"
          minAngle={3}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.stopColor} />
          ))}
          <Label value="any text" position="center" />
        </Pie>
      </PieChart>
    </StyledContainer>
  )
}
