import { gql, useQuery } from '@apollo/client'
import axios from 'axios'
import { LoadingView } from 'components/LoadingView'
import { formatDuration, intervalToDuration } from 'date-fns'
import Layout from 'Layout'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import OpenSeaBlue from 'assets/opensea-blue.svg'
import { OPENSEA_NFT_LINK } from 'constant'
import { Caption, ContentLarge, ContentSmall, Display3, Headline } from 'styles/typography'
import ProgressBar from 'components/ProgressBar'
import Button from 'components/Button'
import { GetPortal, GetPortalVariables } from './__generated__/GetPortal'
import ClockImage from '../clock.png'

export const GET_PORTAL = gql`
  query GetPortal($portalId: BigInt!) {
    ottos(where: { tokenId: $portalId }) {
      tokenId
      tokenURI
      portalStatus
      canSummonAt
      mintAt
    }
  }
`

const StyledPortalPage = styled.div`
  height: 100%;
  background: white;
  padding: 30px;

  display: flex;
  gap: 30px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    align-items: center;
  }
`

const StyledPortalImage = styled.img`
  width: 440px;
  height: 440px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    height: unset;
  }
`

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const StyledOpenSeaLink = styled.a`
  display: flex;
  color: ${({ theme }) => theme.colors.otterBlack};

  &:before {
    content: '';
    background-image: url(${OpenSeaBlue});
    background-size: contain;
    background-repeat: no-repeat;
    width: 21px;
    height: 21px;
    margin-right: 10px;
    display: block;
  }
`

const StyledTitle = styled.p``

const StyledDescription = styled.p``

const StyledStatusContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledStatus = styled.p``

const StyledDuration = styled.p`
  display: flex;
  color: ${({ theme }) => theme.colors.darkGray200};
  &::before {
    content: '';
    background: url(${ClockImage});
    background-size: contain;
    background-repeat: no-repeat;
    width: 21px;
    height: 21px;
    margin-right: 10px;
    display: block;
  }
`

interface PortalMeta {
  name: string
  description: string
  image: string
}

export default function PortalPage() {
  const { t } = useTranslation()
  const { portalId } = useParams()
  const [now, setNow] = useState(Date.now())
  const [portalMeta, setPortalMeta] = useState<PortalMeta | null>(null)
  const { data, loading } = useQuery<GetPortal, GetPortalVariables>(GET_PORTAL, {
    variables: { portalId: portalId || '0' },
  })
  let { canSummonAt } = data?.ottos[0] || {}
  const { tokenURI, portalStatus } = data?.ottos[0] || {}
  canSummonAt = BigInt(1649250000000)

  const progress = useMemo(
    () => 100 - Math.round(((Number(canSummonAt) - now) / (7 * 86400 * 1000)) * 100),
    [canSummonAt, now]
  )
  const duration = useMemo(
    () =>
      formatDuration(
        intervalToDuration({
          start: now,
          end: Number(canSummonAt),
        })
      ),
    [canSummonAt, now]
  )

  useEffect(() => {
    if (tokenURI) {
      axios.get<PortalMeta>(tokenURI).then(res => {
        setPortalMeta(res.data)
      })
    }
  }, [tokenURI])
  useEffect(() => {
    setTimeout(() => setNow(Date.now()), 1000)
  }, [now])

  return (
    <Layout title={t('my_portals.title')}>
      <StyledPortalPage>
        {loading && <LoadingView />}
        {!loading && (
          <>
            <StyledPortalImage src={portalMeta?.image} />{' '}
            <StyledContentContainer>
              <StyledOpenSeaLink href={OPENSEA_NFT_LINK + portalId} target="_blank">
                <Caption>{t('my_portals.opensea_link')}</Caption>
              </StyledOpenSeaLink>
              <StyledTitle>
                <Display3>{portalMeta?.name}</Display3>
              </StyledTitle>
              <StyledDescription>
                <ContentSmall>{portalMeta?.description}</ContentSmall>
              </StyledDescription>
              <StyledStatusContainer>
                <StyledStatus>
                  <ContentLarge>{t(`my_portals.status.${portalStatus}`)}</ContentLarge>
                </StyledStatus>
                <StyledDuration>
                  <Caption>{duration}</Caption>
                </StyledDuration>
              </StyledStatusContainer>
              <ProgressBar height="20px" progress={progress} />
              <Button disabled>
                <Headline>{t('my_portals.open_now')}</Headline>
              </Button>
            </StyledContentContainer>
          </>
        )}
      </StyledPortalPage>
    </Layout>
  )
}
