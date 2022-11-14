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
  padding-top: 8px;
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
  line-height: 1.5em;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 20px;
  }
  max-height: 3em;
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
`

export interface SnapshotProposalGroupInterface {
  className?: string
  tab: GovernanceTab
}

// TODO: Replace with translations
// { active: 'Active', closed: 'Closed'}
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const flagColorFromProposalState: Record<string, string> = {
  active: theme.colors.clamPink,
  closed: theme.colors.darkGray200,
}

export default function SnapshotProposalGroup({ className, tab }: SnapshotProposalGroupInterface) {
  const { t } = useTranslation('', { keyPrefix: 'treasury.governance' })
  const [maximisedProposal, setmaximisedProposal] = useState<string>('')
  const { proposals: ocProposals, fetchMore: otterFetchMore } = useOtterClamProposalsWithVotes()
  const { proposals: qiProposals } = useQiDaoProposals()

  const [needsFetch, setNeedsFetch] = useState<boolean>(false)

  // Could inject proposals from parent,
  // but we need to propogate the fetchMore function from query for caching
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

  const handleScroll = (e: any) => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 30
    if (bottom) {
      setNeedsFetch(true)
      // .then(fetchMoreResult: any => {
      //   // Update variables.limit for the original query to include
      //   // the newly added feed items.
      //   console.log(fetchMoreResult)
      // })
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useMemo(() => {
    if (needsFetch) {
      otterFetchMore({
        variables: {
          skip: proposals.length,
        },
      })
      // .then(fetchMoreResult: any => {
      //   // Update variables.limit for the original query to include
      //   // the newly added feed items.
      //   console.log(fetchMoreResult)
      // })
      setNeedsFetch(false)
      // console.log(proposals)
    }
  }, [needsFetch, proposals, setNeedsFetch, otterFetchMore])

  return (
    <StyledContainer className={className}>
      {proposals.map(proposal => (
        // How do animations work with dynamic content max-height pls help
        <StyledCard key={proposal.id} maxH={maximisedProposal === proposal.id ? '80vh' : '268px'}>
          <StyledInnerContainer>
            <StyledProposalHeadline as="h1">{proposal.title}</StyledProposalHeadline>
            <StyledActivityFlag flagColor={flagColorFromProposalState[proposal.state ?? '']}>
              {capitalizeFirstLetter(proposal.state ?? '')}
            </StyledActivityFlag>
            <StyledInlineText>{`${proposal.votes} ${t('voters')}`}</StyledInlineText>
            <StyledTextBody>
              <ReactMarkdown>{proposal.body ?? ''}</ReactMarkdown>
            </StyledTextBody>
          </StyledInnerContainer>
          <StyledSeeAll onClick={() => toggleMaximisedProposal(proposal.id)}>...See All</StyledSeeAll>
          <SnapshotProposalPieChart proposal={proposal} tab={tab} />
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
