import CLAM from 'assets/clam.svg'
import CLAMCoin from 'assets/icons/CLAM.svg'
import Button from 'components/Button'
import DystopiaPenroseFunnelChart from 'components/DystopiaPenroseFunnelChart'
import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import { useStake } from 'contracts/functions'
import { useTreasuryRealtimeMetrics } from 'contracts/views'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import useGovernanceMetrics from 'hooks/useGovernanceMetrics'
import useOtterClamProposals from 'hooks/useSnapshotProposals'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Headline } from 'styles/typography'

// const StyledOtterClamTab = styled.div`
//   display: block;
//   flex-direction: row;
//   gap: 10px;
// `

const StyledButton = styled(Button)``

interface Props {
  className?: string
}

export default function DystopiaPenroseTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const { metrics } = useGovernanceMetrics()
  console.log(metrics)
  return (
    <div className={className}>
      <Headline as="h1">{t('welcome')}</Headline>
      <ContentSmall as="p">{t('desc')}</ContentSmall>
      <DystopiaPenroseFunnelChart metrics={metrics[0]} />
    </div>
  )
}
