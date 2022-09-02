import { ContentSmall, Display1, Headline, ContentMedium } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import ReactMarkdown from 'react-markdown'
import { Proposal } from '../models/Proposal'
import { GovernanceTab } from '../models/Tabs'
import Button from './Button'
import SnapshotProposalPieChart from './SnapshotProposalPieChart'
import { theme } from 'styles'

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 4px;
  justify-content: space-evenly;
  font-family: 'Pangolin', 'naikaifont' !important;
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
  margin: 4px;
  max-height: 261px;
  width: 100%;
  padding: 15px;
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
  white-space: pre-line;
  max-height: 60%;
  max-width: 60%;
  overflow: hidden;
  border-radius: 10px;
  box-sizing: border-box;
  ul {
    list-style-position: inside;
  }
`

const StyledProposalHeadline = styled.span`
  font-size: 24px;
  font-weight: 400;
  max-width: 60%;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 20px;
  }
  max-height: 3em;
`

const StyledInnerContainer = styled.div`
  display: inline-flex;
  margin: 4px;
`
const StyledActivityFlag = styled.div<{ flagColor: string }>`
  height: 18px;
  background-color: ${({ flagColor }) => flagColor};
  border-radius: 4px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: white;
  line-height: 18px;
  padding: 4px;
  margin: 4px;
  display: inline;
`

const StyledInlineText = styled.span`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.darkGray200};
`

export interface SnapshotProposalGroupInterface {
  className?: string
  proposals: Proposal[]
  tab: GovernanceTab
}

// capitalize only the first letter of the string.
// TODO: Replace with translations
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const flagColorFromProposalState: Record<string, string> = {
  active: theme.colors.clamPink,
  closed: theme.colors.darkGray200,
}

export default function SnapshotProposalGroup({ className, proposals, tab }: SnapshotProposalGroupInterface) {
  const { t } = useTranslation('', { keyPrefix: 'treasury.governance' })
  return (
    <StyledContainer className={className}>
      {proposals.map(proposal => (
        <StyledCard key={proposal.id}>
          <StyledProposalHeadline as="h1">{proposal.title}</StyledProposalHeadline>
          <StyledActivityFlag flagColor={flagColorFromProposalState[proposal.state ?? '']}>
            {capitalizeFirstLetter(proposal.state ?? '')}
          </StyledActivityFlag>
          <StyledInlineText>{`${proposal.votes} ${t('votes')}`}</StyledInlineText>
          <StyledInnerContainer>
            <StyledTextBody>
              <ReactMarkdown>{proposal.body ?? ''}</ReactMarkdown>
            </StyledTextBody>
            <SnapshotProposalPieChart proposal={proposal} tab={tab} />
          </StyledInnerContainer>
          {(proposal.state === 'active' && tab === GovernanceTab.OTTERCLAM) ?? (
            <Button
              padding="6px 48px"
              width="70%"
              Typography={Headline}
              onClick={() => window.open(`https://snapshot.org/#/${proposal.space}/proposal/${proposal.id}`)}
            >
              {t('treasury.governance.voteNow')}
            </Button>
          )}
        </StyledCard>
      ))}
    </StyledContainer>
  )
}
