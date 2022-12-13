import { useEffect, useMemo, useState } from 'react'
import { ContentSmall, Display1, Headline, ContentMedium } from 'styles/typography'
import { theme } from 'styles'
import useQiDaoProposals from 'hooks/useQiDaoProposals'
import useOtterClamProposalsWithVotes from 'hooks/useOtterClamProposalsWithVotes'
import { Proposal } from 'models/Proposal'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { GovernanceTab } from '../models/Tabs'
import SnapshotProposalPieChart from './SnapshotProposalPieChart'
import Button from './Button'

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 4px;
  justify-content: space-evenly;
  font-family: 'Pangolin', 'naikaifont' !important;
`

const StyledCard = styled.div<{ maxH: string }>`
  margin: 4px;
  width: 100%;
  padding: 4px;
  height: auto;
  max-height: ${({ maxH }) => maxH};
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.darkBrown};
  box-shadow: 0px 4px 0px ${({ theme }) => theme.colors.superDarkBrown},
    inset 0px 0px 0px 4px ${({ theme }) => theme.colors.skin};
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  transition: max-height 0.5s ease-in-out;
`

const StyledTextBody = styled.div`
  white-space: pre-line;
  padding-top: 28px;
  border-radius: 10px;
  box-sizing: border-box;
  justify-content: space-between;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-wrap: wrap;
  }
  ul {
    list-style-position: inside;
  }
`

const StyledProposalHeadline = styled.span`
  font-size: 24px;
  font-weight: 400;
  line-height: 1.5em;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 20px;
  }
`

const StyledInnerContainer = styled.div`
  margin: 4px;
  padding: 8px 8px 0 8px;
  height: auto;
  overflow: hidden;
  margin-bottom: 49px;
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
  padding: 4px 4px 20px 4px;
  display: inline-flex;
`

const StyledInlineText = styled.span`
  font-style: normal;
  font-weight: 400;
  margin-left: 8px;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.darkGray200};
`
const StyledLink = styled.a`
  float: right;
  line-height: 18px;
  color: blue;
  :hover {
    text-decoration: underline;
  }
`

const StyledSeeAll = styled.a`
  color: blue;
  align-self: flex-end;
  flex: none;
  display: block;
  position: relative;
  right: 88px;
  width: 0;
  white-space: nowrap;
  bottom: 20px;
  :hover {
    text-decoration: underline;
  }
`

// @media ${({ theme }) => theme.breakpoints.mobile}

export interface SnapshotProposalGroupInterface {
  className?: string
  tab: GovernanceTab
}

const flagColorFromProposalState: Record<string, string> = {
  active: theme.colors.clamPink,
  closed: theme.colors.darkGray200,
}

export default function SnapshotProposalGroup({ className, tab }: SnapshotProposalGroupInterface) {
  const { t } = useTranslation('', { keyPrefix: 'treasury.governance' })
  const [maximisedProposal, setmaximisedProposal] = useState<string>('')
  const { proposals: ocProposals } = useOtterClamProposalsWithVotes()
  const { proposals: qiProposals } = useQiDaoProposals()

  // Could change to inject from parent
  let proposals: Proposal[] = []
  if (tab === GovernanceTab.OTTERCLAM) {
    proposals = ocProposals
  }
  if (tab === GovernanceTab.QIDAO) {
    proposals = qiProposals
  }

  const toggleMaximisedProposal = (key: string) => {
    if (key === maximisedProposal) {
      setmaximisedProposal('')
    } else {
      setmaximisedProposal(key)
    }
  }

  return (
    <StyledContainer className={className}>
      {proposals.map(proposal => (
        // How do animations work with dynamic content max-height pls help
        <StyledCard key={proposal.id} maxH={maximisedProposal === proposal.id ? '150vh' : '420px'}>
          <StyledInnerContainer>
            <StyledProposalHeadline as="h1">{proposal.title}</StyledProposalHeadline>
            <StyledActivityFlag flagColor={flagColorFromProposalState[proposal.state ?? '']}>
              {t(`proposalState.${proposal.state ?? 'default'}`)}
            </StyledActivityFlag>
            <StyledInlineText>{`${proposal.votes} ${t('voters')}`}</StyledInlineText>
            <StyledLink href={`https://snapshot.org/#/${proposal.space}/proposal/${proposal.id}`} target="_blank">
              {t('snapshotEth')}
            </StyledLink>
            <StyledTextBody>
              <SnapshotProposalPieChart proposal={proposal} tab={tab} />
              <ReactMarkdown>{proposal.body ?? ''}</ReactMarkdown>
            </StyledTextBody>
          </StyledInnerContainer>
          <StyledSeeAll onClick={() => toggleMaximisedProposal(proposal.id)}>
            {maximisedProposal === proposal.id ? t('seeLess') : t('seeMore')}
          </StyledSeeAll>
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
