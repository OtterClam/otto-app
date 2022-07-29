import format from 'date-fns/format'
import { formatClamString, formatClamThousandsK, formatUsd, formatUsdThousandsK } from 'utils/currency'
import { Currency, useCurrency } from 'contexts/Currency'
import { trim } from 'helpers/trim'
import { ethers } from 'ethers'
import { GetPearlBankMetrics_pearlBankMetrics } from 'graphs/__generated__/GetPearlBankMetrics'
import useSize from 'hooks/useSize'
import { useTranslation } from 'next-i18next'
import { i18n } from 'i18next'
import React, { RefObject, useRef, useMemo } from 'react'
import { AreaChart, Area, Tooltip } from 'recharts'
import styled from 'styled-components/macro'
import ChartXAxis from 'components/ChartXAxis'
import ChartYAxis from 'components/ChartYAxis'
import ChartTooltip from './ChartTooltip'

const StyledContainer = styled.div`
  height: 260px;
  width: 100%;
`

const xAxisTickProps = { fontSize: '12px' }
const yAxisTickProps = { fontSize: '12px' }

const dataKeysSettings = {
  [Currency.CLAM]: [
    {
      label: 'Pearl Bank',
      dataKey: 'pearlBankDepositedClamAmount',
      stopColor: ['rgba(108, 111, 227, 1)', 'rgba(8, 95, 142, 0.5)'],
    },
    {
      label: 'Clam Pond',
      dataKey: 'clamPondDepositedClamAmount',
      stopColor: ['rgba(255, 172, 161, 1)', 'rgba(255, 172, 161, 0.5)'],
    },
  ],
  [Currency.USD]: [
    {
      label: 'Pearl Bank',
      dataKey: 'pearlBankDepositedUsdValue',
      stopColor: ['rgba(108, 111, 227, 1)', 'rgba(8, 95, 142, 0.5)'],
    },
    {
      label: 'Clam Pond',
      dataKey: 'clamPondDepositedUsdValue',
      stopColor: ['rgba(255, 172, 161, 1)', 'rgba(255, 172, 161, 0.5)'],
    },
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

export interface StakedClamChartProps {
  data: GetPearlBankMetrics_pearlBankMetrics[]
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
        color: keySettingMap[name].stopColor[0],
      }))

    const footer = format(parseInt(payload[0]?.payload?.timestamp ?? '0', 10) * 1000, 'LLL d, yyyy')
    const headerLabel = i18n.t('treasury.dashboard.chartHeaderLabel')
    return items.length > 0 ? (
      <ChartTooltip
        headerLabel={headerLabel}
        headerValue={
          currency === Currency.CLAM
            ? formatClamString(payload[0]?.payload?.totalClamStaked)
            : formatUsd(payload[0]?.payload?.totalClamStakedUsdValue)
        }
        items={items}
        footer={footer}
      />
    ) : null
  }

export default function StakedClamChart({ data }: StakedClamChartProps) {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { t, i18n } = useTranslation()
  const size = useSize(containerRef)
  const { currency } = useCurrency()

  const settings = dataKeysSettings[currency]

  return (
    <StyledContainer ref={containerRef}>
      <AreaChart data={data} width={size?.width ?? 300} height={size?.height ?? 260}>
        <defs>
          {settings.map(({ dataKey: key, stopColor }) => (
            <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stopColor[0]} stopOpacity={1} />
              <stop offset="100%" stopColor={stopColor[1]} stopOpacity={1} />
            </linearGradient>
          ))}
        </defs>
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
          tickCount={2}
          axisLine={false}
          tickLine={false}
          width={40}
          tick={yAxisTickProps}
          tickFormatter={(num: string) =>
            currency === Currency.CLAM ? formatClamThousandsK(num) : formatUsdThousandsK(num)
          }
          domain={[0, 'auto']}
          connectNulls
          allowDataOverflow={false}
        />
        <Tooltip
          wrapperStyle={{ zIndex: 1 }}
          formatter={(value: string) => parseFloat(value)}
          content={renderTooltip(i18n, currency) as any}
        />
        {settings.map(({ dataKey, label }) => (
          <Area
            key={dataKey}
            stroke="none"
            dataKey={dataKey}
            label={label}
            fill={`url(#color-${dataKey})`}
            fillOpacity="1"
            stackId="0"
          />
        ))}
      </AreaChart>
    </StyledContainer>
  )
}
