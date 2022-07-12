import { OtterClamProposals, OtterClamProposals_proposals } from 'graphs/__generated__/OtterClamProposals'
import { Props } from 'react'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'

const StyledContainer = styled.div`
  padding: 15px;
  margin-bottom: 4px;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.darkBrown};
  box-shadow: 0px 4px 0px ${({ theme }) => theme.colors.superDarkBrown},
    inset 0px 0px 0px 4px ${({ theme }) => theme.colors.skin};
  background: ${({ theme }) => theme.colors.white};
`

export interface SnapshotProposalGroup {
  className?: string
  data?: OtterClamProposals_proposals[]
  num_recent_proposals?: number
}

export default function TreasuryCard({ className, data, num_recent_proposals = 3 }: SnapshotProposalGroup) {
  return (
    <StyledContainer className={className}>
      {data?.map(proposal => (
        <StyledContainer>
          <Headline as="h1">{proposal!.title}</Headline>
          <ContentSmall as="p">{proposal!.body}</ContentSmall>
        </StyledContainer>
      ))}
    </StyledContainer>
  )
}
