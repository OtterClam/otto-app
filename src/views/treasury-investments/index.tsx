import Image from 'next/image'
import { format as formatDate } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { ContentExtraSmall, ContentMedium, Headline } from 'styles/typography'
import TreasurySection from 'components/TreasurySection'
import useInvestments from 'hooks/useInvestments'
import { Investments_investments } from 'graphs/__generated__/Investments'
import InvestmentsChart from 'components/InvestmentsChart'
import groupBy from 'lodash/groupBy'
import TreasuryCard from 'components/TreasuryCard'
import { formatUsd } from 'utils/currency'
import useCrossChainTreasuryMetrics from 'hooks/useCrossChainTreasuryMetrics'
import DatePicker from 'components/DatePicker'
import Help from 'components/Help'
import TreasuryMarketValuePieChart from 'components/TreasuryMarketValuePieChart'

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
  font-size: 18px;
`

const StyledInnerTableHeader = styled.tr`
  color: ${({ theme }) => theme.colors.darkGray200};

  justify-content: space-evenly;
  width: 100%;
  display: contents;
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
  margin-bottom: 8px;
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
  :hover {
    background: ${({ theme }) => theme.colors.darkGray200};
  }
`

const StyledCheckbox = styled.input`
  background: ${({ theme }) => theme.colors.darkGray300};
  border: 4px solid ${({ theme }) => theme.colors.darkGray400};
  border-radius: 10px;
  color: white;
  width: 20px;
  height: 24px;
  div {
    font-size: 4px;
  }
`

const StyledMetricsContainer = styled.div`
  position: relative;
  margin: 24px 34px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;

  &::before {
    content: '';
    position: absolute;
    top: -35px;
    right: -45px;
    width: 77px;
    height: 56px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -24px;
    right: -35px;
    width: 105px;
    height: 85px;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: 1fr 1fr;
    grid-gap: 5px;
    margin: 5px;

    &::before {
      width: 51px;
      height: 37px;
      background-size: 51px 37px;
      right: -16px;
      top: -16px;
    }

    &::after {
      width: 70px;
      height: 57px;
      background-size: 70px 57px;
      right: -6px;
      bottom: -5px;
    }
  }
`

const StyledTreasuryCard = styled(TreasuryCard)`
  height: 80px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  color: black;
`

const StyledTextAbove = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-right: 20px;
  font-size: 14px;
`

const StyledPnlNote = styled.div`
  margin: 10px;
  text-align: center;
`

const StyledHeader = styled.h2`
  font-weight: 400;
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
`

const StyledPieCard = styled.div``

const StyledHr = styled.hr<{ width: any }>`
  width: ${({ width }) => width}%;
  justify-content: center;
  display: flex;
  margin: auto;
`
interface InvestmentProps {
  investments: Investments_investments[]
  portfolioPct?: number
  showPnl: boolean
  index: number
}

interface TableHeaders {
  showPnl: boolean
  fromDate: number
  toDate: number
}

function InvestmentPosition({ investments, portfolioPct, showPnl, index }: InvestmentProps) {
  const { t } = useTranslation('', { keyPrefix: 'treasury.investments' })
  const avgGrossApr = useMemo(
    () => investments.reduce((prev, curr) => prev + Number.parseFloat(curr.grossApr), 0) / investments.length,
    [investments]
  )

  const revenueSum = useMemo(
    () => investments.reduce((prev, curr) => prev + Number.parseFloat(curr.grossRevenue), 0),
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

  const fromDate = investments[0].timestamp
  const toDate = investments?.at(-1)?.timestamp

  const theme = useTheme()
  const colorVals = Object.values(theme.colors.rarity)
  return (
    <StyledRow onClick={() => setIsOpen(!isOpen)}>
      <StyledTable>
        <tbody>
          {isOpen && (
            <StyledInnerTableHeader>
              <TableHeaders showPnl={showPnl} fromDate={fromDate} toDate={toDate} />
            </StyledInnerTableHeader>
          )}
          <tr>
            <td>{investments[0].strategy}</td>
            <td>{investments[0].protocol} </td>
            <td>
              {portfolioPct?.toFixed(2)}%{' '}
              <StyledHr color={colorVals[index % colorVals.length]} width={(portfolioPct ?? 0) * 2} />
            </td>
            <td>{avgGrossApr.toFixed(2)}%</td>
            {showPnl && <td>{`${negStr}${valueChangePct.toFixed(2)}%`}</td>}
            {showPnl && <td>{pnlPct.toFixed(2)}%</td>}
          </tr>
        </tbody>
      </StyledTable>
      {isOpen && (
        <StyledChartCard>
          <InvestmentsChart
            stopColor={[colorVals[index % colorVals.length], colorVals[index % colorVals.length]]}
            data={investments}
            avgApr={avgGrossApr}
            key={Math.random()}
          />
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
  const [fromDate, setFromDate] = useState<number>(now - daySecs * 6)
  const [toDate, setToDate] = useState<number>(now)
  const [fromDateOpen, setFromDateOpen] = useState(false)
  const [toDateOpen, setToDateOpen] = useState(false)

  // ensure dates are utc for query, but not ui
  const utcFrom = useMemo(() => new Date(fromDate * 1000).setUTCHours(0, 0, 0, 0) / 1000 + daySecs, [fromDate, daySecs])
  const utcTo = useMemo(() => new Date(toDate * 1000).setUTCHours(0, 0, 0, 0) / 1000 + daySecs, [toDate, daySecs])
  const { investments } = useInvestments(utcFrom, utcTo)
  const { loading, metrics } = useCrossChainTreasuryMetrics()

  const toDateMetrics = useMemo(
    function findClosestMetric() {
      return metrics.length > 0
        ? metrics.reduce(function findClosest(prev, curr) {
            return Math.abs(parseInt(curr.id, 10) - toDate) < Math.abs(parseInt(prev.id, 10) - toDate) ? curr : prev
          })
        : undefined
    },
    [metrics, toDate]
  )

  const lastDataDate = useMemo(() => {
    const groupedInvestments = Object.values(groupBy(investments, i => `${i.protocol}_${i.strategy}`))
    const currentInvestments = groupedInvestments.flatMap(x => x.at(-1))
    const lastDate = Math.max(...currentInvestments.flatMap(x => parseInt(x?.timestamp, 10)))
    return lastDate > 0 ? lastDate : 0
  }, [investments])

  const joinedInvestments = useMemo(() => {
    const groupedInvestments = Object.values(groupBy(investments, i => `${i.protocol}_${i.strategy}`))
    const currentInvestments = groupedInvestments.flatMap(x => x.at(-1))
    const portfolioPcts = currentInvestments.flatMap(x => {
      if (parseInt(x?.timestamp ?? '0', 10) !== lastDataDate) return 0
      return (parseFloat(x?.netAssetValue) / parseFloat(toDateMetrics?.treasuryMarketValue)) * 100
    })
    return groupedInvestments
      .map((x, i) => {
        return { inv: x, pct: portfolioPcts[i] }
      })
      .sort((a, b) => b.pct - a.pct)
  }, [investments, toDateMetrics, lastDataDate])

  const sortedInvestments = useMemo(() => joinedInvestments.map(x => x.inv), [joinedInvestments])
  const revenue = sortedInvestments?.reduce(
    (prev, curr) => prev + curr.reduce((prev2, curr2) => prev2 + Number.parseFloat(curr2.grossRevenue), 0),
    0
  )

  const dateDiff = useMemo(() => (utcTo - utcFrom) / daySecs, [utcFrom, utcTo, daySecs])
  const maybeTmv = toDateMetrics?.treasuryMarketValue ?? 1
  const netApr = (1 + revenue / maybeTmv / dateDiff) ** 365 * 100 - 100
  const [showPnl, setShowPnl] = useState<boolean>(false)
  const showMemo = useMemo(() => showPnl, [showPnl])
  return (
    <StyledContainer className={className}>
      <TreasurySection>
        <StyledMetricsContainer>
          <StyledTreasuryCard>
            <Help message={t('tooltips.tmv', { date: formatDate(toDate * 1000, 'yyyy-M-d') })}>
              <ContentExtraSmall>{t('tmv')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{loading ? '--' : formatUsd(toDateMetrics?.treasuryMarketValue)}</ContentMedium>
          </StyledTreasuryCard>
          <StyledTreasuryCard>
            <Help message={t('tooltips.revenue')}>
              <ContentExtraSmall>{t('totalRevenue')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{loading ? '--' : `${formatUsd(revenue)}`}</ContentMedium>
          </StyledTreasuryCard>
          <StyledTreasuryCard>
            <Help message={t('tooltips.apr')}>
              <ContentExtraSmall>{t('totalApr')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{loading ? '--' : netApr.toFixed(2)}%</ContentMedium>
          </StyledTreasuryCard>
        </StyledMetricsContainer>
      </TreasurySection>
      <TreasurySection>
        <StyledInnerContainer>
          <StyledHeader>{t('header')}</StyledHeader>
          <StyledPieCard>
            <TreasuryMarketValuePieChart
              date={lastDataDate}
              tmv={toDateMetrics?.treasuryMarketValue}
              data={investments}
            />
          </StyledPieCard>
          <StyledDateContainer>
            <StyledTextAbove>
              <div>{t('togglePnl')}</div>
              <StyledCheckbox type="checkbox" onChange={() => setShowPnl(!showPnl)} />
            </StyledTextAbove>

            <StyledDateButton
              onClick={() => {
                setFromDateOpen(true)
              }}
            >
              {t('fromDate')}
              <StyledDate>{formatDate(fromDate * 1000, 'yyyy-M-d')}</StyledDate>
            </StyledDateButton>
            <DatePicker
              isOpen={fromDateOpen}
              onChange={(date: Date | null) => {
                setFromDateOpen(false)
                if (date === null || !date) return
                setFromDate(date.getTime() / 1000)
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
              <StyledDate>{formatDate(toDate * 1000, 'yyyy-M-d')}</StyledDate>
            </StyledDateButton>
            <DatePicker
              isOpen={toDateOpen}
              onChange={(date: Date | null) => {
                setToDateOpen(false)
                if (date === null || !date) return
                setToDate(date.getTime() / 1000)
              }}
              onClose={() => setToDateOpen(false)}
              defaultValue={new Date(now * 1000)}
              minDate={new Date((fromDate + daySecs) * 1000)}
              maxDate={new Date(now * 1000)}
              headerFormat="m/dd"
            />
          </StyledDateContainer>
          {showPnl && <StyledPnlNote>{t('pnlNote')}</StyledPnlNote>}

          <StyledTable>
            <thead>
              <StyledTableHeader>
                <TableHeaders showPnl={showPnl} fromDate={fromDate} toDate={toDate} />
              </StyledTableHeader>
            </thead>
          </StyledTable>
          {sortedInvestments.map((inv, i) => (
            <StyledCard key={`card_${i}`}>
              <InvestmentPosition
                index={i}
                investments={inv}
                portfolioPct={joinedInvestments[i].pct}
                showPnl={showMemo}
              />
            </StyledCard>
          ))}
        </StyledInnerContainer>
      </TreasurySection>
    </StyledContainer>
  )
}

function TableHeaders({ showPnl, fromDate, toDate }: TableHeaders): JSX.Element {
  const { t } = useTranslation('', { keyPrefix: 'treasury.investments' })
  return (
    <>
      <td>{t('tableHeader.investment')}</td>
      <td>{t('tableHeader.protocol')}</td>
      <td>{t('tableHeader.portfolioPct')}</td>
      <td>{t('tableHeader.averageApr')}</td>
      {showPnl && (
        <td>
          <Help
            message={t('tooltips.positionChange', {
              fromDate: formatDate(fromDate * 1000, 'yyyy-M-d'),
              toDate: formatDate(toDate * 1000, 'yyyy-M-d'),
            })}
          >
            {t('tableHeader.positionChange')}
          </Help>
        </td>
      )}
      {showPnl && (
        <td>
          <Help message={t('tooltips.pnl', { fromDate: formatDate(fromDate * 1000, 'yyyy-M-d') })}>
            {t('tableHeader.pnl')}
          </Help>
        </td>
      )}
    </>
  )
}
