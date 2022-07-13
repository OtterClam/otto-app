import CLAM from 'assets/clam.svg'
import CLAMCoin from 'assets/icons/CLAM.svg'
import Button from 'components/Button'
import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import { useStake } from 'contracts/functions'
import { useTreasuryRealtimeMetrics } from 'contracts/views'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import useClamBalance from 'hooks/useClamBalance'
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

export default function OtterClamTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const { proposals } = useOtterClamProposals()
  return (
    <div className={className}>
      <Headline as="h1">{t('welcome')}</Headline>
      <ContentSmall as="p">{t('desc')}</ContentSmall>
      <ContentSmall as="div">
        <SnapshotProposalGroup data={proposals} />
      </ContentSmall>
    </div>
  )
}
