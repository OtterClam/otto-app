import { ContentSmall, Display1, Headline, ContentMedium } from 'styles/typography'
import { OtterClamProposals_proposals } from 'graphs/__generated__/OtterClamProposals'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Proposal } from '../models/Proposal'
import Button from './Button'
import SnapshotProposalPieChart from './SnapshotProposalPieChart'

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 4px;
  justify-content: space-evenly;
`
// `
//   padding: 15px;
//   margin-bottom: 4px;
//   border-radius: 10px;
//   box-sizing: border-box;
//   border: 1px solid ${({ theme }) => theme.colors.darkBrown};
//   box-shadow: 0px 4px 0px ${({ theme }) => theme.colors.superDarkBrown},
//     inset 0px 0px 0px 4px ${({ theme }) => theme.colors.skin};
//   background: ${({ theme }) => theme.colors.white};
// `

const StyledCard = styled.div`
  padding: 15px;
  margin: 4px;
  max-width: 45% !important;
  display: inline-grid;
  align-items: center;
  justify-items: center;
  justify-content: center;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.darkBrown};
  box-shadow: 0px 4px 0px ${({ theme }) => theme.colors.superDarkBrown},
    inset 0px 0px 0px 4px ${({ theme }) => theme.colors.skin};
  background: ${({ theme }) => theme.colors.white};
`

const StyledTextBody = styled.div`
  font-family: 'Pangolin', 'naikaifont';
  white-space: pre-line;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 10em;
  max-width: 80% !important;
  padding: 15px;
  margin: 4px;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.darkBrown};
  box-shadow: 0px 4px 0px ${({ theme }) => theme.colors.superDarkBrown},
    inset 0px 0px 0px 4px ${({ theme }) => theme.colors.skin};
  background: ${({ theme }) => theme.colors.white};
`

const CenteredHeadline = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  max-width: 80%;
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 20px;
  }
`

export interface SnapshotProposalGroup {
  className?: string
  proposals: Proposal[]
}

export default function TreasuryCard({ className, proposals }: SnapshotProposalGroup) {
  const { t } = useTranslation()
  return (
    <StyledContainer className={className}>
      {proposals.map(proposal => (
        <StyledCard key={proposal.id}>
          <CenteredHeadline as="h1">{proposal.title}</CenteredHeadline>
          <StyledTextBody>{proposal.body}</StyledTextBody>
          <SnapshotProposalPieChart proposal={proposal} />
          {proposal.state === 'active' ? (
            <Button
              padding="6px 48px"
              width="70%"
              Typography={Headline}
              onClick={() => window.open(`https://snapshot.org/#/${proposal.space}/proposal/${proposal.id}`)}
            >
              {t('treasury.governance.voteNow')}
            </Button>
          ) : (
            <ContentMedium>{t('treasury.governance.votingClosed')}</ContentMedium>
          )}
        </StyledCard>
      ))}
    </StyledContainer>
  )
}
