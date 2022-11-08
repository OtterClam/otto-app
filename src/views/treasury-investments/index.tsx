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

import TreasuryCard from 'components/TreasuryCard'
import { formatUsd } from 'utils/currency'
const StyledContainer = styled.div``

interface Props {
  className?: string
}

const StyledTable = styled.table`
  width: 100%;
  text-align: center;
  table-layout: fixed;
`

interface InvestmentProps {
  investments?: Investments_investments[]
}

function InvestmentPosition({ investments }: InvestmentProps) {
  if (!investments) return <div></div>
  const avgGrossApr = useMemo(
    () => investments.reduce((prev, curr) => prev + Number.parseFloat(curr.grossApr), 0) / investments.length,
    [investments]
  )

  return (
    <div>
      <StyledTable>
        <tr>
          <td>{investments[0].protocol}</td>
          <td>{investments[0].strategy}</td>
          <td>{avgGrossApr.toFixed(2)}%</td>
          <td>{formatUsd(investments.at(-1)?.grossRevenue)}</td>
        </tr>
      </StyledTable>
      <div>
        <InvestmentsChart data={investments} />
      </div>
    </div>
  )
}

export default function InvestmentsPage({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'investments' })

  const toDate = Date.now() / 1000
  const fromDate = toDate - 60 * 60 * 24 * 7

  const { loading, investments } = useInvestments(fromDate, toDate)

  //TODO: Split investments by [protocol, strategy], sort by Timestamp
  // pass each split to a chart
  const sortedInvestments = Object.values(_.groupBy(investments, i => `${i.protocol}_${i.strategy}`))
  console.log(sortedInvestments)

  //PenroseCLAM/USD+ : [10,12,11,10, ..., 10]
  console.log(sortedInvestments)
  return (
    <StyledContainer className={className}>
      <TreasurySection>
        <StyledTable>
          <tr>
            <td>Protocol</td>
            <td>Strategy</td>
            <td>Average Gross APR</td>
            <td>Latest Revenue</td>
          </tr>
        </StyledTable>
        {sortedInvestments.map(inv => (
          <TreasuryCard>
            <InvestmentPosition investments={inv} />
          </TreasuryCard>
        ))}
      </TreasurySection>
    </StyledContainer>
  )
}
