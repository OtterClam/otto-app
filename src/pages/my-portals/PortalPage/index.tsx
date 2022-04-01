import { gql, useQuery } from '@apollo/client'
import OpenSeaBlue from 'assets/opensea-blue.svg'
import Button from 'components/Button'
import { LoadingView } from 'components/LoadingView'
import ProgressBar from 'components/ProgressBar'
import { OPENSEA_NFT_LINK } from 'constant'
import Layout from 'Layout'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Display3, Headline } from 'styles/typography'
import ClockImage from '../clock.png'
import PortalContainer from '../PortalContainer'
import { GetPortal, GetPortalVariables } from './__generated__/GetPortal'

export const GET_PORTAL = gql`
  query GetPortal($portalId: BigInt!) {
    ottos(where: { tokenId: $portalId }) {
      tokenId
      tokenURI
      portalStatus
      canOpenAt
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
  min-width: 440px;
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

const StyledTitle = styled.p`
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledDescription = styled.p`
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledStatusContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledStatus = styled.p`
  color: ${({ theme }) => theme.colors.otterBlack};
`

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

export default function PortalPage() {
  const { t } = useTranslation()
  const { portalId } = useParams()
  const { data, loading } = useQuery<GetPortal, GetPortalVariables>(GET_PORTAL, {
    variables: { portalId: portalId || '0' },
  })
  return (
    <Layout title={t('my_portals.title')}>
      <StyledPortalPage>
        {loading && <LoadingView />}
        {data && (
          <PortalContainer rawPortal={data.ottos[0]}>
            {({ state, duration, progress, metadata }) => (
              <>
                <StyledPortalImage src={metadata?.image} />
                <StyledContentContainer>
                  <StyledOpenSeaLink href={OPENSEA_NFT_LINK + portalId} target="_blank">
                    <Caption>{t('my_portals.opensea_link')}</Caption>
                  </StyledOpenSeaLink>
                  <StyledTitle>
                    <Display3>{metadata?.name}</Display3>
                  </StyledTitle>
                  <StyledDescription>
                    <ContentSmall>{metadata?.description}</ContentSmall>
                  </StyledDescription>
                  <StyledStatusContainer>
                    <StyledStatus>
                      <ContentLarge>{t(`my_portals.state.${state}`)}</ContentLarge>
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
          </PortalContainer>
        )}
      </StyledPortalPage>
    </Layout>
  )
}
