import Image from 'next/image'
import Arrow from 'views/store/StoreHero/arrow.svg'
import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ContentMedium, Headline } from 'styles/typography'
import TreasurySection from 'components/TreasurySection'
import useInvestments from 'hooks/useInvestments'
import { Investments_investments } from 'graphs/__generated__/Investments'

const StyledContainer = styled.div``

interface Props {
  className?: string
}

export default function InvestmentsPage({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'investments' })

  const toDate = Date.now() / 1000
  const fromDate = toDate - 60 * 60 * 24 * 7

  const { loading, investments } = useInvestments(fromDate, toDate)

  console.log(investments)

  return (
    <StyledContainer className={className}>
      <TreasurySection>
        {investments.map(investment => (
          <div>
            <p>{investment.strategy}</p>
            <p>{investment.protocol}</p>
          </div>
        ))}
      </TreasurySection>
    </StyledContainer>
  )
}
