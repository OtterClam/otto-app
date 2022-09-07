import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import useOtterClamProposalsWithVotes from 'hooks/useOtterClamProposalsWithVotes'
import { GovernanceTab } from 'models/Tabs'

interface Props {
  className?: string
}

export default function OtterClamTab({ className }: Props) {
  const { proposals } = useOtterClamProposalsWithVotes()
  return <SnapshotProposalGroup className={className} proposals={proposals} tab={GovernanceTab.OTTERCLAM} />
}
