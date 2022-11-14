import Image from 'next/image'
import Arrow from 'views/store/StoreHero/arrow.svg'
import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ContentMedium, Headline } from 'styles/typography'
import TreasurySection from 'components/TreasurySection'
import useInvestments from 'hooks/useInvestments'
import { Investments_investments } from 'graphs/__generated__/Investments'
import InvestmentsChart from 'components/InvestmentsChart'
import * as _ from 'lodash'
import LinkIcon from './link_icon.svg'

import TreasuryCard from 'components/TreasuryCard'
import { formatUsd } from 'utils/currency'
import useTreasuryMetrics from 'hooks/useTreasuryMetrics'
import DatePicker from 'components/DatePicker'

const StyledContainer = styled.div`
  font-family: 'Pangolin', 'naikaifont' !important;
  color: white;
`
interface Props {
  className?: string
}

const StyledTableHeader = styled.tr`
  color: ${({ theme }) => theme.colors.lightGray400};
  padding-top: 20px;
`

const StyledTable = styled.table`
  width: 100%;
  text-align: center;
  table-layout: fixed;
`
const StyledRow = styled.div`
  cursor: url('/cursor-pointer.png') 7 0, auto;
`

const StyledInnerContainer = styled.div`
  padding: 15px;
  margin-bottom: 4px;
  border-radius: 10px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.otterBlack};
`
const StyledCard = styled.div`
  padding: 15px;
  margin-bottom: 8px;
  border-radius: 10px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.darkGray400};
`

const StyledChartCard = styled.div`
  padding: 15px;
  margin: 16px 0;
  border-radius: 10px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.otterBlack};
`
const StyledImage = styled(Image)`
  height: 100px;
  width: 100px;
  fill: white;
`

const StyledDateContainer = styled.div`
  display: flex;
  justify-content: right;
  font-family: 'Pangolin', 'naikaifont' !important;
`

const StyledDateButton = styled.button`
  font-family: 'Pangolin', 'naikaifont' !important;
  color: white;
`

const StyledDate = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  padding: 4px;
  background: ${({ theme }) => theme.colors.darkGray300};
  border: 4px solid ${({ theme }) => theme.colors.darkGray400};
  border-radius: 10px;
`
interface InvestmentProps {
  investments?: Investments_investments[]
  portfolioPct?: number
}

function InvestmentPosition({ investments, portfolioPct }: InvestmentProps) {
  if (!investments) return <div></div>

  const avgGrossApr = useMemo(
    () => investments?.reduce((prev, curr) => prev + Number.parseFloat(curr.grossApr), 0) / investments.length,
    [investments]
  )

  const revenueSum = useMemo(
    () => investments?.reduce((prev, curr) => prev + Number.parseFloat(curr.grossRevenue), 0),
    [investments]
  )

  const original = parseFloat(investments[0]?.netAssetValue)
  const newVal = parseFloat(investments.at(-1)?.netAssetValue)
  const gain = original < newVal
  const valueChange = gain ? newVal - original : original - newVal
  const negStr = !gain ? '-' : ''

  const valueChangePct = (valueChange / parseFloat(investments[0]?.netAssetValue)) * 100

  const pnl = gain ? revenueSum + valueChange : revenueSum - valueChange
  const pnlPct = (pnl / parseFloat(investments[0]?.netAssetValue)) * 100

  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <StyledRow onClick={() => setIsOpen(!isOpen)}>
      <StyledTable>
        <tbody>
          <tr>
            <td>{investments[0].strategy}</td>
            <td>
              {investments[0].protocol}{' '}
              {/* <StyledImage height={100} style={{ display: 'unset !important' }} src={LinkIcon} /> */}
            </td>
            <td>{portfolioPct?.toFixed(2)}%</td>
            <td>{avgGrossApr.toFixed(2)}%</td>
            {/* <td>{formatUsd(investments.at(-1)?.grossRevenue)}</td> */}
            <td>{`${negStr}${valueChangePct.toFixed(2)}%`}</td>
            <td>{pnlPct.toFixed(2)}%</td>
          </tr>
        </tbody>
      </StyledTable>
      {isOpen && (
        <StyledChartCard>
          <InvestmentsChart data={investments} avgApr={avgGrossApr} key={Math.random()} />
        </StyledChartCard>
      )}
    </StyledRow>
  )
}

export default function InvestmentsPage({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'treasury.investments' })

  const daySecs = 60 * 60 * 24
  const nowDate = new Date(Date.now()).setHours(0, 0, 0, 0)
  const now = nowDate / 1000
  const [fromDate, setFromDate] = useState<number>(now - daySecs * 7)
  const [toDate, setToDate] = useState<number>(now)
  const [fromDateOpen, setFromDateOpen] = useState(false)
  const [toDateOpen, setToDateOpen] = useState(false)

  const { investments } = useInvestments(fromDate, toDate)
  const { loading, metrics } = useTreasuryMetrics()

  const joinedInvestments = useMemo(() => {
    const groupedInvestments = Object.values(_.groupBy(investments, i => `${i.protocol}_${i.strategy}`))
    const currentInvestments = groupedInvestments.flatMap(x => x.at(-1))
    const tmv = currentInvestments?.reduce((prev, curr) => prev + Number.parseFloat(curr?.netAssetValue), 0)
    const portfolioPcts = currentInvestments.flatMap(x => (parseFloat(x?.netAssetValue) / tmv) * 100)
    return groupedInvestments
      .map((x, i) => {
        return { inv: x, pct: portfolioPcts[i] }
      })
      .sort((a, b) => b.pct - a.pct)
  }, [investments])

  const sortedInvestments = useMemo(() => joinedInvestments.map(x => x.inv), [joinedInvestments])
  const toDateMetrics = useMemo(
    () =>
      metrics.reduce(function (prev, curr) {
        return Math.abs(parseInt(curr.id) - toDate) < Math.abs(parseInt(prev.id) - toDate) ? curr : prev
      }),
    [metrics, toDate]
  )

  return (
    <StyledContainer className={className}>
      <TreasurySection>
        <StyledInnerContainer>
          <StyledDateContainer>
            <StyledDateButton
              onClick={() => {
                setFromDateOpen(true)
              }}
            >
              {t('fromDate')}
              <StyledDate>{new Date(fromDate * 1000).toDateString()}</StyledDate>
            </StyledDateButton>
            <DatePicker
              isOpen={fromDateOpen}
              onChange={(date: Date | null) => {
                setFromDateOpen(false)
                if (date === null) return
                setFromDate(date?.getTime() / 1000)
              }}
              onClose={() => setFromDateOpen(false)}
              defaultValue={new Date(fromDate * 1000)}
              minDate={new Date((now - daySecs * 90) * 1000)}
              maxDate={new Date((toDate - daySecs) * 1000)}
              headerFormat="m/dd"
            />

            <StyledDateButton
              onClick={() => {
                setToDateOpen(true)
              }}
            >
              {t('toDate')}
              <StyledDate>{new Date(toDate * 1000).toDateString()}</StyledDate>
            </StyledDateButton>
            <DatePicker
              isOpen={toDateOpen}
              onChange={(date: Date | null) => {
                setToDateOpen(false)
                if (date === null) return
                setToDate(date?.getTime() / 1000)
              }}
              onClose={() => setToDateOpen(false)}
              defaultValue={new Date(now * 1000)}
              minDate={new Date((fromDate + daySecs) * 1000)}
              maxDate={new Date(now * 1000)}
              headerFormat="m/dd"
            />
          </StyledDateContainer>

          <StyledTable>
            <thead>
              <StyledTableHeader>
                <td>{t('tableHeader.investment')}</td>
                <td>{t('tableHeader.protocol')}</td>
                <td>{t('tableHeader.portfolioPct')}</td>
                <td>{t('tableHeader.averageApr')}</td>
                <td>{t('tableHeader.positionChange')}</td>
                <td>{t('tableHeader.pnl')}</td>
              </StyledTableHeader>
            </thead>
          </StyledTable>
          {sortedInvestments.map((inv, i) => (
            <StyledCard key={`card_${i}`}>
              <InvestmentPosition investments={inv} portfolioPct={joinedInvestments[i].pct} />
            </StyledCard>
          ))}
        </StyledInnerContainer>
      </TreasurySection>
    </StyledContainer>
  )
}
