import Button from 'components/Button'
import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import useOtterClamProposals from 'hooks/useOtterClamProposals'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { ContentSmall, Headline } from 'styles/typography'

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
      <SnapshotProposalGroup proposals={proposals} />
    </div>
  )
}
