import { ContentSmall, Display1, Headline, ContentMedium } from 'styles/typography'
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
  width: 100%;
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
  overflow-y: hidden;
  overflow-x: hidden;
  max-height: 100%;
  padding: 15px;
  margin: 4px;
  border-radius: 10px;
  box-sizing: border-box;
`

const StyledProposalHeadline = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  font-size: 24px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 20px;
  }
`
const StyledChartContainer = styled.div``

const StyledInnerContainer = styled.div`
  display: inline-flex;
`
export interface SnapshotProposalGroupInterface {
  className?: string
  proposals: Proposal[]
}

export default function SnapshotProposalGroup({ className, proposals }: SnapshotProposalGroupInterface) {
  const { t } = useTranslation()
  return (
    <StyledContainer className={className}>
      {proposals.map(proposal => (
        <StyledCard key={proposal.id}>
          <StyledProposalHeadline as="h1">{proposal.title}</StyledProposalHeadline>
          <StyledInnerContainer>
            <StyledTextBody>{proposal.body}</StyledTextBody>
            {/* <StyledChartContainer></StyledChartContainer> */}
            <SnapshotProposalPieChart proposal={proposal} />
          </StyledInnerContainer>
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
