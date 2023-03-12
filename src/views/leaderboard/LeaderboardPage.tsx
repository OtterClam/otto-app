import Board, { Background } from 'components/Board'
import EpochBanner from 'components/EpochBanner'
import LeaderboardTabs from 'components/LeaderboardTabs'
import { useApi } from 'contexts/Api'
import { useLeaderboardEpoch } from 'contexts/LeaderboardEpoch'
import { useRarityEpoch } from 'contexts/RarityEpoch'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import APBoostEmptyImage from './ap-boost-empty.png'
import Info from './Info'
import LeftInfo from './left-info.png'
import RankList from './RankList'
import RightInfo from './right-info.png'

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

export default function LeaderboardPage() {
  const { t } = useTranslation('', {
    keyPrefix: 'leaderboard',
  })

  const { constellation } = useRarityEpoch()
  const {
    epoch: { themes },
  } = useLeaderboardEpoch()
  const [boost, setBoost] = useState<null | {
    location: string
    successRate: number
    image: string
  }>(null)
  const api = useApi()
  const router = useRouter()
  const isAdventure = Boolean(router.query.adventure)

  useEffect(() => {
    api
      .getAdventureBoost()
      .then(setBoost)
      .catch(err => {
        console.error('failed getAdventureBoost', err.message)
      })
  }, [api])

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
            {isAdventure && boost && (
              <Info
                image={boost.image}
                desc={t('left_info_ap', boost)}
                links={[
                  {
                    text: t('left_info_link_ap'),
                    href: 'https://docs.ottopia.app/ottopia/events/adventure-competition-s1',
                  },
                ]}
              />
            )}
            {isAdventure && !boost && (
              <Info
                image={APBoostEmptyImage.src}
                desc={t('left_info_ap_empty')}
                links={[
                  {
                    text: t('left_info_link_ap'),
                    href: 'https://docs.ottopia.app/ottopia/events/adventure-competition-s1',
                  },
                ]}
              />
            )}
            {!isAdventure && (
              <Info
                image={LeftInfo.src}
                desc={t('left_info', {
                  themes,
                })}
                links={[
                  {
                    text: t('left_info_link'),
                    href: 'https://docs.ottopia.app/ottopia/events/rarity-competition-s2',
                  },
                ]}
              />
            )}
            <Info
              image={RightInfo.src}
              desc={t('right_info', {
                constellation,
              })}
              links={[]}
            />
          </StyledInfos>
          <StyledRankList />
        </StyledLeaderboardPage>
      </StyledBoard>
    </StyledContainer>
  )
}
