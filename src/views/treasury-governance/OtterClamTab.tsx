import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import useOtterClamProposalsWithVotes from 'hooks/useOtterClamProposalsWithVotes'
import { GovernanceTab } from 'models/Tabs'

interface Props {
  className?: string
}

export default function OtterClamTab({ className }: Props) {
  return <SnapshotProposalGroup className={className} tab={GovernanceTab.OTTERCLAM} />
}
