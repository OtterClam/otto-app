import MyOttosProvider, { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ContentLarge, ContentMedium, Headline, Note } from 'styles/typography'
import CLAM from 'assets/clam.png'
import { useEffect, useState } from 'react'
import ArrowDown from 'assets/ui/arrow_down.svg'
import { gql, useQuery } from '@apollo/client'
import cursorPointer from 'assets/cursor-pointer.png'
import { useOttos } from 'hooks/useOtto'
import Button from 'components/Button'
import Otto from 'models/Otto'
import { ListRankedOttos, ListRankedOttosVariables } from './__generated__/ListRankedOttos'
import LoadingGif from './loading.gif'

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
`

const StyledOttoRow = styled(StyledRow)`
  color: ${({ theme }) => theme.colors.otterBlack};
  width: 100%;
  position: relative;
  padding: 10px 40px;

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

  > * {
    &:nth-child(2) {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
    &:nth-last-child(2) {
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
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

const StyledAvatarName = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20px;
`

const StyledOttoAvatar = styled.img`
  width: 100px;
  height: 100px;
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
`

const StyledPagination = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 40px;
`

const StyledPaginationButton = styled(Button)<{ show: boolean }>`
  opacity: ${({ show }) => (show ? 1 : 0)};
`

interface Props {
  className?: string
}

const PAGE = 20

export default function RankList({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'leaderboard.rank_list' })
  const [page, setPage] = useState(0)
  const {
    data,
    loading: loadingGraph,
    refetch,
  } = useQuery<ListRankedOttos, ListRankedOttosVariables>(LIST_RANKED_OTTOS, {
    variables: { skip: page * PAGE, first: PAGE },
  })
  const { ottos, loading: loadingApi } = useOttos(data?.ottos, false)
  // const { ottos: myOttos } = useMyOttos()
  const myOttos: any[] = []
  const [expand, setExpand] = useState(false)
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
            {(expand ? myOttos : myOttos.slice(0, 1)).map(({ name, image, baseRarityScore }, index) => (
              <StyledMyOttoRow key={index}>
                <StyledTd as="div">{index + 1}</StyledTd>
                <StyledTd as="div">
                  <StyledAvatarName>
                    <StyledMyOttoAvatar src={image} />
                    {name}
                  </StyledAvatarName>
                </StyledTd>
                <StyledTd as="div">
                  <StyledReward>TBD</StyledReward>
                </StyledTd>
                <StyledTd as="div">{baseRarityScore}</StyledTd>
                <StyledTd as="div">{baseRarityScore}</StyledTd>
                <StyledTd as="div">{baseRarityScore}</StyledTd>
              </StyledMyOttoRow>
            ))}
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
                <StyledTd as="div">{totalRarityScore}</StyledTd>
                <StyledTd as="div">{baseRarityScore}</StyledTd>
                <StyledTd as="div">{relativeRarityScore}</StyledTd>
              </StyledOttoRow>
            </a>
          ))}
      </StyledTable>
      {!loading && (
        <StyledPagination>
          <StyledPaginationButton primaryColor="white" onClick={() => setPage(p => p - 1)} show={page > 0}>
            <Headline>{t('prev')}</Headline>
          </StyledPaginationButton>
          <Button primaryColor="white" onClick={() => setPage(p => p + 1)}>
            <Headline>{t('next')}</Headline>
          </Button>
        </StyledPagination>
      )}
    </StyledRankList>
  )
}
