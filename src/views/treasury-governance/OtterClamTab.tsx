import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import useOtterClamProposalsWithVotes from 'hooks/useOtterClamProposalsWithVotes'
import { GovernanceTab } from 'models/Tabs'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { ContentSmall, Headline } from 'styles/typography'

interface Props {
  className?: string
}

export default function OtterClamTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const { proposals } = useOtterClamProposalsWithVotes()
  return (
    <div className={className}>
      <Headline as="h1">{t('welcome')}</Headline>
      <ContentSmall as="p">{t('desc')}</ContentSmall>
      <SnapshotProposalGroup proposals={proposals} tab={GovernanceTab.OTTERCLAM} />
    </div>
  )
}
