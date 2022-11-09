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

const StyledContainer = styled.div`
  font-family: 'Pangolin', 'naikaifont' !important;
  color: white;
`
interface Props {
  className?: string
}

const StyledTableHeader = styled.tr`
  color: ${({ theme }) => theme.colors.lightGray400};
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

  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <StyledRow onClick={() => setIsOpen(!isOpen)}>
      <StyledTable>
        <tr>
          <td>{investments[0].strategy}</td>
          <td>
            {investments[0].protocol} <StyledImage height={100} src={LinkIcon} />
          </td>
          <td>{portfolioPct?.toFixed(2)}%</td>
          <td>{avgGrossApr.toFixed(2)}%</td>
          <td>{formatUsd(investments.at(-1)?.grossRevenue)}</td>
        </tr>
      </StyledTable>
      {isOpen && (
        <StyledChartCard>
          <InvestmentsChart data={investments} />
        </StyledChartCard>
      )}
    </StyledRow>
  )
}

export default function InvestmentsPage({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'investments' })

  const toDate = Date.now() / 1000
  const fromDate = toDate - 60 * 60 * 24 * 7

  const { loading, investments } = useInvestments(fromDate, toDate)
  const { latestMetrics } = useTreasuryMetrics()

  const groupedInvestments = Object.values(_.groupBy(investments, i => `${i.protocol}_${i.strategy}`))
  const currentInvestments = groupedInvestments.flatMap(x => x.at(-1))
  const portfolioPcts = currentInvestments.flatMap(
    x => (parseFloat(x?.netAssetValue) / latestMetrics?.treasuryMarketValue) * 100
  )
  //order of the pcts AFTER sorting
  //sort

  const joinedInvestments = groupedInvestments
    .map((x, i) => {
      return { inv: x, pct: portfolioPcts[i] }
    })
    .sort((a, b) => b.pct - a.pct)

  const sortedInvestments = joinedInvestments.map(x => x.inv)

  return (
    <StyledContainer className={className}>
      <TreasurySection>
        <StyledInnerContainer>
          <StyledTable>
            <StyledTableHeader>
              <td>Investment</td>
              <td>Protocol</td>
              <td>Portfolio Percentage</td>
              <td>Average Gross APR</td>
              <td>Latest Revenue</td>
            </StyledTableHeader>
          </StyledTable>
          {sortedInvestments.map((inv, i) => (
            <StyledCard>
              <InvestmentPosition investments={inv} portfolioPct={joinedInvestments[i].pct} />
            </StyledCard>
          ))}
        </StyledInnerContainer>
      </TreasurySection>
    </StyledContainer>
  )
}
