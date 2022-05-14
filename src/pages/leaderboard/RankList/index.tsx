import { gql, useQuery } from '@apollo/client'
import CLAM from 'assets/clam.png'
import cursorPointer from 'assets/cursor-pointer.png'
import ArrowDown from 'assets/ui/arrow_down.svg'
import Button from 'components/Button'
import { useMediaQuery } from 'hooks/useMediaQuery'
import { useOttos } from 'hooks/useOtto'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import { breakpoints } from 'styles/breakpoints'
import { ContentLarge, ContentMedium, Headline } from 'styles/typography'
import OttOLoading from 'assets/ui/otto-loading.jpg'
import { useMyOttos } from 'MyOttosProvider'
import RarityScore from './rarity_score.png'
import LoadingGif from './loading.gif'
import { ListRankedOttos, ListRankedOttosVariables } from './__generated__/ListRankedOttos'

export const LIST_RANKED_OTTOS = gql`
  query ListRankedOttos($first: Int!, $skip: Int!) {
    ottos(orderBy: rarityScore, orderDirection: desc, first: $first, skip: $skip) {
      tokenId
      tokenURI
      mintAt
      legendary
      brs
      rrs
      rarityScore
    }
  }
`

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

const StyledMyOttoSection = styled.section`
  padding: 10px 40px;
  background-color: ${({ theme }) => theme.colors.crownYellow};
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
  cursor: url(${cursorPointer}) 7 0, auto;
  margin-top: 10px;

  &:after {
    content: ' ';
    width: 24px;
    height: 24px;
    background-image: url(${ArrowDown});
    background-size: 100%;
    transform: rotate(${({ expand }) => (expand ? '180deg' : '0deg')});
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

const StyledTh = styled(ContentMedium)``

const StyledTd = styled(ContentLarge)``

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

const StyledAvatarName = styled(ContentLarge)`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  grid-column-start: span 2;
`

const StyledOttoAvatar = styled.img`
  width: 100px;
  height: 100px;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 60px;
    height: 60px;
  }

  background: url(${OttOLoading});
  background-size: 100% 100%;
`

const StyledReward = styled(ContentLarge)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:before {
    content: '';
    width: 24px;
    height: 24px;
    background-image: url(${CLAM});
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
  grid-template-rows: 1fr 1fr;
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

const StyledPaginationLink = styled(Link)<{ show: boolean }>`
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

function useQueryString() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function RankList({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'leaderboard.rank_list' })
  const page = Number(useQueryString().get('page')) || 0
  const {
    data,
    loading: loadingGraph,
    refetch,
  } = useQuery<ListRankedOttos, ListRankedOttosVariables>(LIST_RANKED_OTTOS, {
    variables: { skip: page * PAGE, first: PAGE },
  })
  const { ottos, loading: loadingApi } = useOttos(data?.ottos, false)
  const { ottos: myOttos } = useMyOttos()
  const sortedMyOttos = useMemo(() => myOttos.sort((a, b) => a.ranking - b.ranking), [myOttos])
  const [expand, setExpand] = useState(false)
  const isMobile = useMediaQuery(breakpoints.mobile)
  useEffect(() => {
    refetch({ skip: page * PAGE, first: PAGE })
  }, [page])
  const loading = loadingGraph || loadingApi
  return (
    <StyledRankList className={className}>
      <StyledTable>
        {myOttos.length > 0 && (
          <StyledMyOttoSection>
            <StyledHint>{t('your_rank')}</StyledHint>
            {(expand ? sortedMyOttos : sortedMyOttos.slice(0, 1)).map(
              ({ tokenId, name, image, ranking, totalRarityScore, baseRarityScore, relativeRarityScore }, index) => (
                <a key={index} href={`/my-ottos/${tokenId}`} target="_blank" rel="noreferrer">
                  {isMobile ? (
                    <StyledMobileRow>
                      <StyledTd as="div">{ranking}</StyledTd>
                      <StyledOttoAvatar src={image} />
                      <StyledMobileContent>
                        <StyledAvatarName as="div">{name}</StyledAvatarName>
                        <StyledReward as="div">TBD</StyledReward>
                        <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
                      </StyledMobileContent>
                    </StyledMobileRow>
                  ) : (
                    <StyledMyOttoRow>
                      <StyledTd as="div">{ranking}</StyledTd>
                      <StyledTd as="div">
                        <StyledAvatarName as="div">
                          <StyledMyOttoAvatar src={image} />
                          {name}
                        </StyledAvatarName>
                      </StyledTd>
                      <StyledTd as="div">
                        <StyledReward>TBD</StyledReward>
                      </StyledTd>
                      <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
                      <StyledTd as="div">{baseRarityScore}</StyledTd>
                      <StyledTd as="div">{relativeRarityScore}</StyledTd>
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
          <StyledTh as="div">{t('rank')}</StyledTh>
          <StyledTh as="div">{t('name')}</StyledTh>
          <StyledTh as="div">{t('est_reward')}</StyledTh>
          <StyledTh as="div">{t('rarity_score')}</StyledTh>
          <StyledTh as="div">{t('brs')}</StyledTh>
          <StyledTh as="div">{t('rrs')}</StyledTh>
        </StyledTableHead>
        {loading && (
          <StyledLoading>
            <img src={LoadingGif} alt="loading" />
          </StyledLoading>
        )}
        {!loading &&
          ottos.map(({ tokenId, name, image, baseRarityScore, relativeRarityScore, totalRarityScore }, index) => (
            <a key={page * PAGE + index} href={`/ottos/${tokenId}`} target="_blank" rel="noreferrer">
              {isMobile ? (
                <StyledMobileRow>
                  <StyledTd as="div">{page * PAGE + index + 1}</StyledTd>
                  <StyledOttoAvatar src={image} />
                  <StyledMobileContent>
                    <StyledAvatarName as="div">{name}</StyledAvatarName>
                    <StyledReward as="div">TBD</StyledReward>
                    <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
                  </StyledMobileContent>
                </StyledMobileRow>
              ) : (
                <StyledOttoRow>
                  <StyledTd as="div">{page * PAGE + index + 1}</StyledTd>
                  <StyledTd as="div">
                    <StyledAvatarName>
                      <StyledOttoAvatar src={image} />
                      {name}
                    </StyledAvatarName>
                  </StyledTd>
                  <StyledTd as="div">
                    <StyledReward>TBD</StyledReward>
                  </StyledTd>
                  <StyledRarityScore>{totalRarityScore}</StyledRarityScore>
                  <StyledTd as="div">{baseRarityScore}</StyledTd>
                  <StyledTd as="div">{relativeRarityScore}</StyledTd>
                </StyledOttoRow>
              )}
            </a>
          ))}
      </StyledTable>
      {!loading && (
        <StyledPagination>
          <StyledPaginationLink to={`?page=${page - 1}`} show={page > 0}>
            <StyledButton primaryColor="white" padding="20px">
              <Headline>{t('prev')}</Headline>
            </StyledButton>
          </StyledPaginationLink>
          <StyledPaginationLink to={`?page=${page + 1}`} show>
            <StyledButton primaryColor="white" padding="20px">
              <Headline>{t('next')}</Headline>
            </StyledButton>
          </StyledPaginationLink>
        </StyledPagination>
      )}
    </StyledRankList>
  )
}
