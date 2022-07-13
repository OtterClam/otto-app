import { OtterClamProposals_proposals } from 'graphs/__generated__/OtterClamProposals'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import SnapshotProposalPieChart from './SnapshotProposalPieChart'

const StyledContainer = styled.div``
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

const FixedSizeHeadline = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  max-width: 80% !important;
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
  data?: OtterClamProposals_proposals[]
}

export default function TreasuryCard({ className, data }: SnapshotProposalGroup) {
  return (
    <StyledContainer className={className}>
      {data?.map(proposal => (
        <StyledCard key={proposal.id}>
          <FixedSizeHeadline as="h1">{proposal!.title}</FixedSizeHeadline>
          <StyledTextBody>{proposal!.body}</StyledTextBody>
          <SnapshotProposalPieChart proposal={proposal!}></SnapshotProposalPieChart>
        </StyledCard>
      ))}
    </StyledContainer>
  )
}
