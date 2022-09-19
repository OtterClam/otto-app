import Button from 'components/Button'
import { useRarityEpoch } from 'contexts/RarityEpoch'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { Display3, Headline } from 'styles/typography'
import { useLeaderboardEpoch } from 'contexts/LeaderboardEpoch'
import Hero from './Hero'
import Info from './Info'
import RightInfo from './right-info.png'
import RankList from './RankList'
import LeftInfo from './left-info.png'

const StyledLeaderboardPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  padding: 40px 70px;
  gap: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 40px 5px;
  }
`

const StyledHead = styled(Display3).attrs({ as: 'h1' })`
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-between;

  > * {
    flex: 1;
  }
`

const StyledHero = styled(Hero)``

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

export default function LeaderboardPage() {
  const { t } = useTranslation('', { keyPrefix: 'leaderboard' })
  const { epoch, latestEpoch, hasPrevEpoch, hasNextEpoch } = useRarityEpoch()
  const {
    epoch: { themes },
  } = useLeaderboardEpoch()

  return (
    <StyledLeaderboardPage>
      <StyledHead>
        {hasPrevEpoch ? (
          <Link
            href={{
              pathname: '/leaderboard',
              search: `?epoch=${epoch === -1 ? latestEpoch - 1 : epoch - 1}`,
            }}
          >
            <a>
              <Button padding="0 6px" Typography={Headline}>
                {t('prev')}
              </Button>
            </a>
          </Link>
        ) : (
          <div />
        )}
        {t('head')}
        {hasNextEpoch ? (
          <Link
            href={{
              pathname: '/leaderboard',
              search: `?epoch=${epoch + 1 === latestEpoch ? -1 : epoch + 1}`,
            }}
          >
            <a>
              <Button padding="0 6px" Typography={Headline}>
                {t('next')}
              </Button>
            </a>
          </Link>
        ) : (
          <div />
        )}
      </StyledHead>
      <StyledHero />
      <StyledInfos>
        <Info
          image={LeftInfo.src}
          desc={t('left_info', { themes })}
          links={[{ text: t('left_info_link'), href: 'https://docs.ottopia.app/ottopia/events/rarity-competition-s2' }]}
        />
        <Info image={RightInfo.src} desc={t('right_info')} links={[]} />
      </StyledInfos>
      <StyledRankList />
    </StyledLeaderboardPage>
  )
}
