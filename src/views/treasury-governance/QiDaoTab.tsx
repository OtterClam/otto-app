import Button from 'components/Button'
import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import { GovernanceTab } from 'models/Tabs'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'

const StyledButton = styled(Button)``
interface Props {
  className?: string
}

export default function QiDaoTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'treasury.governance' })
  return (
    <div className={className}>
      <SnapshotProposalGroup tab={GovernanceTab.QIDAO} />
    </div>
  )
}
