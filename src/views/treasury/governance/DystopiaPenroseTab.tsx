import Button from 'components/Button'
import DystopiaPenroseFunnelChart from 'components/DystopiaPenroseFunnelChart'
import PenroseVotesPieChart from 'components/PenroseVotesPieChart'
import SnapshotProposalGroup from 'components/SnapshotProposalGroup'
import useGovernanceMetrics from 'hooks/useGovernanceMetrics'
import usePenroseVotes from 'hooks/usePenroseVotes'
import useOtterClamProposals from 'hooks/useOtterClamProposals'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Headline } from 'styles/typography'

const CenteredHeadline = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  white-space: none;
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 20px;
  }
`

const StyledButton = styled(Button)``

interface Props {
  className?: string
}

export default function DystopiaPenroseTab({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const { loading: loadingMetrics, metrics } = useGovernanceMetrics()
  const { loading: loadingVotes, votes } = usePenroseVotes()

  const otterClamVlPenRounded = parseFloat(metrics?.[0]?.otterClamVlPenPercentOwned ?? 'NaN').toFixed(2)
  const otterClamVeDystRounded = parseFloat(metrics?.[0]?.otterClamVeDystPercentOwned ?? 'NaN').toFixed(2)

  return !(loadingMetrics || loadingVotes) ? (
    <div className={className}>
      <CenteredHeadline as="h1">
        {'OtterClam controls '}
        <span style={{ color: 'red' }}>{`${otterClamVlPenRounded}%`}</span>
        {' of Penrose voting power,'}
      </CenteredHeadline>
      <CenteredHeadline as="h1">
        {'equivalent to '}
        <span style={{ color: 'red' }}>{`${otterClamVeDystRounded}%`}</span>
        {' of total Dystopia voting power.'}
      </CenteredHeadline>
      <ContentSmall as="p">{}</ContentSmall>
      <DystopiaPenroseFunnelChart metrics={metrics} />
      <CenteredHeadline as="h1">{"Current Distribtuion of OtterClam's Penrose Vote Allocation:"}</CenteredHeadline>
      <PenroseVotesPieChart votes={votes} />
    </div>
  ) : (
    //TODO: Loading spinner
    <></>
  )
}
