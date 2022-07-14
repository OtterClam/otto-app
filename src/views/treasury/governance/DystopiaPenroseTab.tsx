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
  return (
    <div className={className}>
      <Headline as="h1">{`OtterClam controls ${parseFloat(metrics[0].otterClamVlPenPercentOwned).toFixed(
        2
      )}% of Penrose voting power,`}</Headline>
      <Headline as="h1">{`equivalent to ${parseFloat(metrics[0].otterClamVeDystPercentOwned).toFixed(
        2
      )}% of total Dystopia voting power.`}</Headline>
      <ContentSmall as="p">{}</ContentSmall>
      <DystopiaPenroseFunnelChart metrics={metrics} />
    </div>
  )
}
