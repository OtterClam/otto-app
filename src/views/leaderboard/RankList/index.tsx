import { useQuery } from '@apollo/client'
import CLAM from 'assets/clam.png'
import cursorPointer from 'assets/cursor-pointer.png'
import ArrowDown from 'assets/ui/arrow_down.svg'
import Button from 'components/Button'
import { numberWithSign } from 'helpers/number'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useOttos } from 'hooks/useOtto'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { breakpoints } from 'styles/breakpoints'
import { Caption, ContentLarge, ContentMedium, Headline } from 'styles/typography'
import OttOLoading from 'assets/ui/otto-loading.jpg'
import { useMyOttos } from 'MyOttosProvider'
import { trim } from 'helpers/trim'
import Otto from 'models/Otto'
import { ROUND_RARITY_REWARD_AFTER_3, ROUND_RARITY_REWARD_BEFORE_3, TOTAL_RARITY_REWARD } from 'constant'
import Constellations from 'assets/constellations'
import useRarityEpoch from 'hooks/useRarityEpoch'
import { createSearchParams } from 'utils/url'
import { useRouter } from 'next/router'
import { LIST_RANKED_OTTOS } from 'graphs/otto'
import { ListRankedOttos, ListRankedOttosVariables } from 'graphs/__generated__/ListRankedOttos'
import RarityScore from './rarity_score.png'
import LoadingGif from './loading.gif'
import FirstRank from './Icon/Rank/1st.png'
import SecondRank from './Icon/Rank/2nd.png'
import ThirdRank from './Icon/Rank/3rd.png'

const StyledRankList = styled.div`
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  overflow: hidden;
`

const StyledTable = styled.section`
  width: 100%;
`

const StyledRow = styled.div`
  display: flex;
  align-items: center;

  > * {
    &:nth-child(1) {
      // rank
      width: 80px;
      text-align: center;
    }
    &:nth-child(2) {
      flex: 1;
    }
    &:nth-child(3) {
      // reward
      width: 154px;
      text-align: center;
    }
    &:nth-child(4) {
      // rarity score
      width: 122px;
      text-align: center;
    }
    &:nth-child(5),
    &:nth-child(6) {
      // brs + rrs
      width: 64px;
      text-align: center;
    }
  }
`

const StyledTableHead = styled(StyledRow)`
  height: 47px;
  background: ${({ theme }) => theme.colors.lightGray200};
  padding: 10px 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledOttoRow = styled(StyledRow)`
  color: ${({ theme }) => theme.colors.otterBlack};
  width: 100%;
  position: relative;
  padding: 10px 40px;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 10px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray100};
  }
  &:before {
    position: absolute;
    content: '';
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray200};
    width: calc(100% - 80px);
    transform: translateX(-50%);
    bottom: 0px;
    left: 50%;
  }
`

const StyledMyOttoSection = styled.section<{ isLatestEpoch: boolean }>`
  padding: 10px 40px;
  background-color: ${({ isLatestEpoch, theme }) =>
    isLatestEpoch ? theme.colors.crownYellow : theme.colors.lightGray400};
  display: flex;
  flex-direction: column;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 10px;
  }

  > * {
    &:nth-child(2) {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      overflow: hidden;
    }
    &:nth-last-child(2) {
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      overflow: hidden;
    }
  }
`

const StyledHint = styled(ContentMedium)`
  margin-bottom: 10px;
`

const StyledMyOttoRow = styled(StyledRow)`
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 0px;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray100};
  }
`

const StyledExpandColumn = styled(ContentMedium)<{ expand: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  cursor: url(${cursorPointer.src}) 7 0, auto;
  margin-top: 10px;

  &:after {
    content: ' ';
    width: 24px;
    height: 24px;
    background-image: url(${ArrowDown.src});
    background-size: 100%;
    transform: rotate(${({ expand }) => (expand ? '180deg' : '0deg')});
  }
`

const StyledTags = styled.div`
  display: flex;
  gap: 5px;
  grid-column-start: span 2;

  @media ${({ theme }) => theme.breakpoints.tablet} {
    flex-direction: column;
  }
`

const StyledMyOttoAvatar = styled.img`
  width: 60px;
  height: 60px;
`

const StyledLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 300px;
  }
`

const StyledTh = styled(ContentMedium).attrs({ as: 'div' })``

const StyledTd = styled(ContentLarge).attrs({ as: 'div' })``

const StyledRank = styled(ContentLarge).attrs({ as: 'div' })<{ rank: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 42px;
  color: ${({ rank, theme }) => (rank <= 3 ? 'transparent' : theme.colors.otterBlack)};
  background: url(${({ rank }) =>
      rank === 1 ? FirstRank.src : rank === 2 ? SecondRank.src : rank === 3 ? ThirdRank.src : ''})
    no-repeat;
  background-size: 42px 42px;
  background-position: center;
`

const StyledRarityScore = styled(ContentLarge).attrs({
  as: 'div',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:before {
    content: '';
    width: 24px;
    height: 24px;
    background-image: url(${RarityScore});
    background-size: 100%;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    justify-content: start;
  }
`

const StyledAvatarName = styled(ContentLarge).attrs({ as: 'div' })`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  grid-column-start: span 2;
`

const StyledNameColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const StyledChosenOne = styled(Caption).attrs({ as: 'div' })`
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 5px;
  gap: 5px;
  background: ${({ theme }) => theme.colors.crownYellow};
  border-radius: 5px;

  img {
    width: 21px;
    height: 21px;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    img {
      width: 18px;
      height: 18px;
    }
  }
`

const StyledHelldiceBoost = styled(StyledChosenOne)`
  background: ${({ theme }) => theme.colors.lightGray300};
`

const StyledZodiacSignBonus = styled(StyledChosenOne)`
  background: ${({ theme }) => theme.colors.lightGray300};
`

const StyledOttoAvatar = styled.img`
  width: 100px;
  height: 100px;
  min-width: 100px;
  background: url(${OttOLoading.src});
  background-size: 100% 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 60px;
    height: 60px;
    min-width: 60px;
  }
`

const StyledReward = styled(ContentLarge).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:before {
    content: '';
    width: 24px;
    height: 24px;
    background-image: url(${CLAM.src});
    background-size: 100%;
  }
  @media ${({ theme }) => theme.breakpoints.mobile} {
    justify-content: start;
  }
`

const StyledMobileRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.white};
  gap: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray200};
`

const StyledMobileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 5px;
  width: 100%;
`

const StyledPagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin: 20px;
    gap: 20px;
  }
`

const StyledPaginationLink = styled.a<{ show: boolean }>`
  opacity: ${({ show }) => (show ? 1 : 0)};
  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex: 1;
    width: 100%;
  }
`

const StyledButton = styled(Button)`
  width: 100%;
`

interface Props {
  className?: string
}

const PAGE = 20

export default function RankList({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'leaderboard.rank_list' })
  const router = useRouter()
  const page = Number(router.query.page || 0)
  const { epoch, isLatestEpoch, totalOttoSupply } = useRarityEpoch()
  const {
    data,
    loading: loadingGraph,
    refetch,
  } = useQuery<ListRankedOttos, ListRankedOttosVariables>(LIST_RANKED_OTTOS, {
    variables: { skip: page * PAGE, first: PAGE, epoch },
  })
  const prizeCount = Math.floor(totalOttoSupply * 0.5)
  const topReward = useMemo(() => {
    let sum = 0
    const totalReward = epoch > 3 || epoch === -1 ? ROUND_RARITY_REWARD_AFTER_3 : ROUND_RARITY_REWARD_BEFORE_3
    for (let i = 1; i <= prizeCount; i++) {
      sum += 1 / i
    }
    return totalReward / sum
  }, [prizeCount, epoch])
  const getEstimatedReward = (rank: number) => (rank <= prizeCount ? trim(topReward * (1 / rank), 2) : '-')
  const { ottos, loading: loadingApi } = useOttos(data?.ottos, { details: true, epoch })
  const { ottos: myOttos } = useMyOttos()
  const sortedMyOttos = useMemo(() => myOttos.sort((a, b) => a.ranking - b.ranking), [myOttos])
  const [expand, setExpand] = useState(false)
  const { isMobile } = useBreakpoints()
  useEffect(() => {
    refetch({ skip: page * PAGE, first: PAGE })
  }, [page])
  const loading = loadingGraph || loadingApi
  const renderRow = (
    rank: number,
    {
      tokenId,
      smallImage: image,
      name,
      totalRarityScore,
      baseRarityScore,
      relativeRarityScore,
      zodiacBoost,
      isChosenOne,
      zodiacSign,
      epochRarityBoost,
      diceCount,
    }: Otto
  ) => {
    return (
      <a key={rank} href={`/ottos/${tokenId}`} target="_blank" rel="noreferrer">
        {isMobile ? (
          <StyledMobileRow>
            <StyledTd>
              <StyledRank rank={rank}>{rank}</StyledRank>
            </StyledTd>
            <StyledOttoAvatar src={image} />
            <StyledMobileContent>
              <StyledAvatarName>{name}</StyledAvatarName>
              <StyledTags>
                {zodiacBoost > 0 &&
                  (isChosenOne ? (
                    <StyledChosenOne>
                      <img src="/trait-icons/Birthday.png" alt="The Otter" />
                      {t('chosen_one')}
                    </StyledChosenOne>
                  ) : (
                    <StyledZodiacSignBonus>
                      <img src={Constellations[zodiacSign]} alt={zodiacSign} />
                      {t('zodiac_boost', { zodiac: zodiacSign })}
                    </StyledZodiacSignBonus>
                  ))}
                {(diceCount ?? 0) > 0 && (
                  <StyledHelldiceBoost>
                    <img src="/trait-icons/Dice.png" alt="Hell Dice" />
                    {t('hell_dice', { diceCount, boost: numberWithSign(epochRarityBoost ?? 0) })}
                  </StyledHelldiceBoost>
                )}
              </StyledTags>
              <StyledReward as="div">{getEstimatedReward(rank)}</StyledReward>
              <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
            </StyledMobileContent>
          </StyledMobileRow>
        ) : (
          <StyledOttoRow>
            <StyledTd>
              <StyledRank rank={rank}>{rank}</StyledRank>
            </StyledTd>
            <StyledTd>
              <StyledAvatarName>
                <StyledOttoAvatar src={image} />
                <StyledNameColumn>
                  {name}
                  <StyledTags>
                    {zodiacBoost > 0 &&
                      (isChosenOne ? (
                        <StyledChosenOne>
                          <img src="/trait-icons/Birthday.png" alt="The Otter" />
                          {t('chosen_one')}
                        </StyledChosenOne>
                      ) : (
                        <StyledZodiacSignBonus>
                          <img src={Constellations[zodiacSign]} alt={zodiacSign} />
                          {t('zodiac_boost', { zodiac: zodiacSign })}
                        </StyledZodiacSignBonus>
                      ))}
                    {(diceCount ?? 0) > 0 && (
                      <StyledHelldiceBoost>
                        <img src="/trait-icons/Dice.png" alt="Hell Dice" />
                        {t('hell_dice', { diceCount, boost: numberWithSign(epochRarityBoost ?? 0) })}
                      </StyledHelldiceBoost>
                    )}
                  </StyledTags>
                </StyledNameColumn>
              </StyledAvatarName>
            </StyledTd>
            <StyledTd>
              <StyledReward>{getEstimatedReward(rank)}</StyledReward>
            </StyledTd>
            <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
            <StyledTd>{baseRarityScore}</StyledTd>
            <StyledTd>{relativeRarityScore}</StyledTd>
          </StyledOttoRow>
        )}
      </a>
    )
  }

  return (
    <StyledRankList className={className}>
      <StyledTable>
        {myOttos.length > 0 && (
          <StyledMyOttoSection isLatestEpoch={isLatestEpoch}>
            <StyledHint>{t('your_rank')}</StyledHint>
            {(expand ? sortedMyOttos : sortedMyOttos.slice(0, 1)).map(
              (
                { tokenId, name, smallImage: image, ranking, totalRarityScore, baseRarityScore, relativeRarityScore },
                index
              ) => (
                <a key={index} href={`/my-ottos/${tokenId}`} target="_blank" rel="noreferrer">
                  {isMobile ? (
                    <StyledMobileRow>
                      <StyledRank rank={ranking}>{ranking}</StyledRank>
                      <StyledOttoAvatar src={image} />
                      <StyledMobileContent>
                        <StyledAvatarName>{name}</StyledAvatarName>
                        <StyledReward as="div">{getEstimatedReward(ranking)}</StyledReward>
                        <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
                      </StyledMobileContent>
                    </StyledMobileRow>
                  ) : (
                    <StyledMyOttoRow>
                      <StyledRank rank={ranking}>{ranking}</StyledRank>
                      <StyledTd>
                        <StyledAvatarName>
                          <StyledMyOttoAvatar src={image} />
                          <StyledNameColumn>{name}</StyledNameColumn>
                        </StyledAvatarName>
                      </StyledTd>
                      <StyledTd>
                        <StyledReward>{getEstimatedReward(ranking)}</StyledReward>
                      </StyledTd>
                      <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
                      <StyledTd>{baseRarityScore}</StyledTd>
                      <StyledTd>{relativeRarityScore}</StyledTd>
                    </StyledMyOttoRow>
                  )}
                </a>
              )
            )}
            <StyledExpandColumn as="div" expand={expand} onClick={() => setExpand(expand => !expand)}>
              {expand ? t('show_less') : t('expand', { count: myOttos.length })}
            </StyledExpandColumn>
          </StyledMyOttoSection>
        )}
        <StyledTableHead>
          <StyledTh>{t('rank')}</StyledTh>
          <StyledTh>{t('name')}</StyledTh>
          <StyledTh>{t('est_reward')}</StyledTh>
          <StyledTh>{t('rarity_score')}</StyledTh>
          <StyledTh>{t('brs')}</StyledTh>
          <StyledTh>{t('rrs')}</StyledTh>
        </StyledTableHead>
        {loading && (
          <StyledLoading>
            <img src={LoadingGif.src} alt="loading" />
          </StyledLoading>
        )}
        {!loading && ottos.map((otto, index) => renderRow(page * PAGE + index + 1, otto))}
      </StyledTable>
      {!loading && (
        <StyledPagination>
          <Link
            href={{
              pathname: '/leaderboard',
              search: `?${createSearchParams({ page: String(page - 1), epoch: String(epoch) })}`,
            }}
          >
            <StyledPaginationLink show={page > 0}>
              <StyledButton primaryColor="white" padding="20px" Typography={Headline}>
                {t('prev')}
              </StyledButton>
            </StyledPaginationLink>
          </Link>
          <Link
            href={{
              pathname: '/leaderboard',
              search: `?${createSearchParams({ page: String(page + 1), epoch: String(epoch) })}`,
            }}
          >
            <StyledPaginationLink show>
              <StyledButton primaryColor="white" padding="20px" Typography={Headline}>
                {t('next')}
              </StyledButton>
            </StyledPaginationLink>
          </Link>
        </StyledPagination>
      )}
    </StyledRankList>
  )
}
