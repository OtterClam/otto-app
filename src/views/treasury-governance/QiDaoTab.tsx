import Button from 'components/Button'
import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import useQiDaoProposals from 'hooks/useQiDaoProposals'
import { GovernanceTab } from 'models/Tabs'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { ContentSmall, Headline } from 'styles/typography'

const StyledButton = styled(Button)``
interface Props {
  className?: string
}

export default function QiDaoTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'treasury.governance' })
  const { proposals } = useQiDaoProposals()
  return (
    <div className={className}>
      <Headline as="h1">{t('welcome')}</Headline>
      <ContentSmall as="p">{t('desc')}</ContentSmall>
      <SnapshotProposalGroup tab={GovernanceTab.QIDAO} />
    </div>
  )
}
