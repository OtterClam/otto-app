import Board, { Background } from 'components/Board'
import { useRarityEpoch } from 'contexts/RarityEpoch'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Display3 } from 'styles/typography'
import { useLeaderboardEpoch } from 'contexts/LeaderboardEpoch'
import LeaderboardTabs from 'components/LeaderboardTabs'
import EpochBanner from 'components/EpochBanner'
import Head from 'next/head'
import Info from './Info'
import RightInfo from './right-info.png'
import RankList from './RankList'
import LeftInfo from './left-info.png'

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledLeaderboardPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  padding: 40px 70px;
  gap: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 15px 5px 5px;
  }
`

const StyledHead = styled(Display3).attrs({ as: 'h1' })`
  width: 100%;
  text-align: center;
`

const StyledInfos = styled.div`
  display: flex;
  gap: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
  }
`

const StyledRankList = styled(RankList)`
  width: 100%;
`

const StyledBoard = styled(Board)`
  width: 100%;
`

const StyledEpochNav = styled.div`
  margin-bottom: -1.5em;
  display: flex;
  justify-content: space-between;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin-bottom: 15px;
  }
`

const StyledTitlie = styled.div``

export default function LeaderboardPage() {
  const { t } = useTranslation('', { keyPrefix: 'leaderboard' })
  const { constellation, epoch, hasPrevEpoch, hasNextEpoch } = useRarityEpoch()
  const {
    epoch: { themes },
  } = useLeaderboardEpoch()

  return (
    <StyledContainer>
      <Head>
        <title>{t('docTitle')}</title>
        <meta property="og:title" content={t('docTitle')} />
        <meta name="description" content={t('docDesc')} />
        <meta property="og:description" content={t('docDesc')} />
        <meta property="og:image" content="/og.jpg" />
      </Head>
      <LeaderboardTabs />
      <StyledBoard background={Background.Dark}>
        <StyledLeaderboardPage>
          <EpochBanner />
          <StyledInfos>
            <Info
              image={LeftInfo.src}
              desc={t('left_info', { themes })}
              links={[
                { text: t('left_info_link'), href: 'https://docs.ottopia.app/ottopia/events/rarity-competition-s2' },
              ]}
            />
            <Info image={RightInfo.src} desc={t('right_info', { constellation })} links={[]} />
          </StyledInfos>
          <StyledRankList />
        </StyledLeaderboardPage>
      </StyledBoard>
    </StyledContainer>
  )
}
