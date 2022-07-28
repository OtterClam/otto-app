import { trim } from 'helpers/trim'
import format from 'date-fns/format'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import React, { RefObject, useRef } from 'react'
import { BarChart, Tooltip, Bar } from 'recharts'
import { i18n } from 'i18next'
import { Currency, useCurrency } from 'contexts/Currency'
import styled from 'styled-components/macro'
import ChartXAxis from 'components/ChartXAxis'
import ChartYAxis from 'components/ChartYAxis'
import { GetTreasuryRevenue_treasuryRevenues } from 'graphs/__generated__/GetTreasuryRevenue'
import ChartTooltip from './ChartTooltip'
import { formatClamString, formatClamThousandsK, formatUsd, formatUsdThousandsK } from 'utils/currency'

const StyledContainer = styled.div`
  height: 260px;
  width: 100%;
`

const xAxisTickProps = { fontSize: '12px' }
const yAxisTickProps = { fontSize: '12px' }

const formatCurrency = (c: number, maxDigits: number = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: 0,
  }).format(c)
}
const dataKeysSettings = {
  [Currency.CLAM]: [
    { dataKey: 'qiClamAmount', colors: ['rgba(244, 210, 88, 1)', 'rgba(244, 210, 88, 0.5)'], label: 'Qi' },
    { dataKey: 'ottopiaClamAmount', colors: ['rgba(255, 172, 161, 1)', 'rgba(255, 172, 161, 0.5)'], label: 'CLAM' },
    { dataKey: 'dystClamAmount', colors: ['rgba(8, 95, 142, 0.6)', 'rgba(8, 95, 142, 0.3)'], label: 'DYST' },
    { dataKey: 'penDystClamAmount', colors: ['rgba(108, 111, 227, 1)', 'rgba(8, 95, 142, 0.5)'], label: 'penDYST' },
    { dataKey: 'penClamAmount', colors: ['rgba(128, 131, 235, 0.8)', 'rgba(252, 236, 255, 0.5)'], label: 'PEN' },
  ],
  [Currency.USD]: [
    { dataKey: 'qiMarketValue', colors: ['rgba(244, 210, 88, 1)', 'rgba(244, 210, 88, 0.5)'], label: 'Qi' },
    { dataKey: 'ottopiaMarketValue', colors: ['rgba(255, 172, 161, 1)', 'rgba(255, 172, 161, 0.5)'], label: 'CLAM' },
    { dataKey: 'dystMarketValue', colors: ['rgba(8, 95, 142, 0.6)', 'rgba(8, 95, 142, 0.3)'], label: 'DYST' },
    { dataKey: 'penDystMarketValue', colors: ['rgba(108, 111, 227, 1)', 'rgba(8, 95, 142, 0.5)'], label: 'penDYST' },
    { dataKey: 'penMarketValue', colors: ['rgba(128, 131, 235, 0.8)', 'rgba(252, 236, 255, 0.5)'], label: 'PEN' },
  ],
}

const settingsToMap = (settings: typeof dataKeysSettings[Currency.CLAM]) => {
  return settings.reduce(
    (map, setting) =>
      Object.assign(map, {
        [setting.dataKey]: setting,
      }),
    {} as { [k: string]: typeof settings[0] }
  )
}

const keySettingMap = {
  ...settingsToMap(dataKeysSettings[Currency.CLAM]),
  ...settingsToMap(dataKeysSettings[Currency.USD]),
}

export interface TreasuryRevenueChartProps {
  data: GetTreasuryRevenue_treasuryRevenues[]
}

const renderTooltip: (i18nClient: i18n, currency: Currency) => TooltipRenderer =
  (i18n, currency) =>
  ({ payload, active }) => {
    if (!active || !payload?.length) {
      return null
    }
    const items = payload
      .filter(({ value }) => Math.round(value) > 0)
      .map(({ name, value }) => ({
        key: name,
        label: keySettingMap[name].label,
        value: currency === Currency.CLAM ? formatClamString(value) : formatUsd(value),
        color: (keySettingMap[name].colors ?? [])[0],
      }))
    const footer = format(parseInt(payload[0]?.payload?.timestamp ?? '0', 10) * 1000, 'LLL d, yyyy')
    const headerLabel = i18n.t('treasury.dashboard.chartHeaderLabel')
    return (
      <ChartTooltip
        headerLabel={headerLabel}
        headerValue={
          currency === Currency.CLAM
            ? formatClamString(payload[0]?.payload?.totalRevenueClamAmount)
            : formatUsd(payload[0]?.payload?.totalRevenueMarketValue)
        }
        items={items}
        footer={footer}
      />
    )
  }

export default function TreasuryRevenueChart({ data }: TreasuryRevenueChartProps) {
  const { currency } = useCurrency()
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { i18n } = useTranslation()
  const size = useSize(containerRef)
  const settings = dataKeysSettings[currency]

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
          axisLine={false}
          tickCount={3}
          tickLine={false}
          width={40}
          interval="preserveEnd"
          tick={yAxisTickProps}
          tickFormatter={(num: string) =>
            currency === Currency.CLAM ? formatClamThousandsK(num) : formatUsdThousandsK(num)
          }
          domain={[0, (dataMax: number) => dataMax * 1.1]}
          connectNulls
          allowDataOverflow
        />
        <Tooltip wrapperStyle={{ zIndex: 1 }} content={renderTooltip(i18n, currency) as any} />
        {settings.map(({ dataKey: key, colors }, i) => {
          return <Bar key={i} dataKey={key} stroke={colors[0]} fill={colors[0]} fillOpacity={1} stackId="1" />
        })}
      </BarChart>
    </StyledContainer>
  )
}
