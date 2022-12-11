import Image from 'next/image'
import Arrow from 'views/store/StoreHero/arrow.svg'
import { format as formatDate } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ContentExtraSmall, ContentMedium, Headline } from 'styles/typography'
import TreasurySection from 'components/TreasurySection'
import useInvestments from 'hooks/useInvestments'
import { Investments_investments } from 'graphs/__generated__/Investments'
import InvestmentsChart from 'components/InvestmentsChart'
import * as _ from 'lodash'
import TreasuryCard from 'components/TreasuryCard'
import { formatUsd } from 'utils/currency'
import useTreasuryMetrics from 'hooks/useTreasuryMetrics'
import DatePicker from 'components/DatePicker'
import Help from 'components/Help'

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

const StyledToggleButton = styled.button`
  padding: 1px;
  background: ${({ theme }) => theme.colors.darkGray300};
  border: 4px solid ${({ theme }) => theme.colors.darkGray400};
  border-radius: 10px;
  color: white;
  :hover {
    background: ${({ theme }) => theme.colors.darkGray200};
  }
  padding-top: 0px;
  height: 28px;
  margin-top: 18px;
  margin-right: 20px;
  font-family: 'Pangolin', 'naikaifont' !important;
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
interface InvestmentProps {
  investments: Investments_investments[]
  portfolioPct?: number
  showPnl?: boolean
}

function InvestmentPosition({ investments, portfolioPct, showPnl }: InvestmentProps) {
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

  return (
    <StyledRow onClick={() => setIsOpen(!isOpen)}>
      <StyledTable>
        <tbody>
          {isOpen && (
            <StyledInnerTableHeader>
              <tr>
                <td>{t('tableHeader.investment')}</td>
                <td>{t('tableHeader.protocol')}</td>
                <td>{t('tableHeader.portfolioPct')}</td>
                <td>{t('tableHeader.averageApr')}</td>
                <td>{t('tableHeader.positionChange')}</td>
                <td>{t('tableHeader.pnl')}</td>
              </tr>
            </StyledInnerTableHeader>
          )}
          <tr>
            <td>{investments[0].strategy}</td>
            <td>
              {investments[0].protocol}{' '}
              {/* <StyledImage height={100} style={{ display: 'unset !important' }} src={LinkIcon} /> */}
            </td>
            <td>{portfolioPct?.toFixed(2)}%</td>
            <td>{avgGrossApr.toFixed(2)}%</td>
            {/* <td>{formatUsd(investments.at(-1)?.grossRevenue)}</td> */}
            {showPnl && <td>{`${negStr}${valueChangePct.toFixed(2)}%`}</td>}
            {showPnl && <td>{pnlPct.toFixed(2)}%</td>}
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

  const toDateMetrics = useMemo(
    () =>
      metrics.reduce(function (prev, curr) {
        return Math.abs(parseInt(curr.id, 10) - toDate) < Math.abs(parseInt(prev.id, 10) - toDate) ? curr : prev
      }),
    [metrics, toDate]
  )

  const joinedInvestments = useMemo(() => {
    const groupedInvestments = Object.values(_.groupBy(investments, i => `${i.protocol}_${i.strategy}`))
    const currentInvestments = groupedInvestments.flatMap(x => x.at(-1))
    const portfolioPcts = currentInvestments.flatMap(x => {
      if (parseInt(x?.timestamp ?? '0', 10) !== parseInt(toDateMetrics.id, 10) - daySecs) return 0
      return (parseFloat(x?.netAssetValue) / parseFloat(toDateMetrics.treasuryMarketValue)) * 100
    })
    return groupedInvestments
      .map((x, i) => {
        return { inv: x, pct: portfolioPcts[i] }
      })
      .sort((a, b) => b.pct - a.pct)
  }, [investments, toDateMetrics])

  const sortedInvestments = useMemo(() => joinedInvestments.map(x => x.inv), [joinedInvestments])
  const revenue = sortedInvestments?.reduce(
    (prev, curr) => prev + curr.reduce((prev2, curr2) => prev2 + Number.parseFloat(curr2.grossRevenue), 0),
    0
  )

  const dateDiff = useMemo(() => (toDate - fromDate) / daySecs, [toDate, fromDate])
  const netApr = (1 + revenue / toDateMetrics.treasuryMarketValue / dateDiff) ** 365 * 100 - 100

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
            <ContentMedium>{loading ? '--' : formatUsd(toDateMetrics.treasuryMarketValue)}</ContentMedium>
          </StyledTreasuryCard>
          <StyledTreasuryCard>
            <Help message={t('tooltips.revenue')}>
              <ContentExtraSmall>{t('totalRevenue')}</ContentExtraSmall>
            </Help>
            <ContentMedium>{loading ? '--' : `${formatUsd(revenue)} / ${dateDiff.toFixed(0)} days`}</ContentMedium>
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
          <StyledDateContainer>
            <StyledToggleButton onClick={() => setShowPnl(!showPnl)}>{t('togglePnl')}</StyledToggleButton>
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

          {showPnl && <p>{t('pnlNote')}</p>}
          <StyledTable>
            <thead>
              <StyledTableHeader>
                <td>{t('tableHeader.investment')}</td>
                <td>{t('tableHeader.protocol')}</td>
                <td>{t('tableHeader.portfolioPct')}</td>
                <td>{t('tableHeader.averageApr')}</td>
                {showPnl && <td>{t('tableHeader.positionChange')}</td>}
                {showPnl && <td>{t('tableHeader.pnl')}</td>}
              </StyledTableHeader>
            </thead>
          </StyledTable>
          {sortedInvestments.map((inv, i) => (
            <StyledCard key={`card_${i}`}>
              <InvestmentPosition investments={inv} portfolioPct={joinedInvestments[i].pct} showPnl={showMemo} />
            </StyledCard>
          ))}
        </StyledInnerContainer>
      </TreasurySection>
    </StyledContainer>
  )
}
