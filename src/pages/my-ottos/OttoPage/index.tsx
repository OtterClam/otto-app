import { useQuery } from '@apollo/client'
import OpenSeaBlue from 'assets/opensea-blue.svg'
import { LoadingView } from 'components/LoadingView'
import { getOpenSeaLink } from 'constant'
import Layout from 'Layout'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Caption, ContentSmall, Display3 } from 'styles/typography'
import ClockImage from '../clock.png'
import OttoContainer from '../OttoContainer'
import { GET_OTTO } from '../queries'
import { GetOtto, GetOttoVariables } from '../__generated__/GetOtto'

const StyledOttoPage = styled.div`
  min-height: 100%;
  background: white;
  padding: 30px;
`

const StyledOttoInfo = styled.div`
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
  flex: 1;
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

const StyledOpenDesc = styled.div`
  padding: 30px;
  background: ${({ theme }) => theme.colors.lightGray100};
  border: 4px solid ${({ theme }) => theme.colors.lightGray400};
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`

const StyledOpenImg = styled.img`
  width: 98px;
`

const StyledOpenDescText = styled.p``

const StyledOpenDescNumber = styled(ContentSmall)`
  color: ${({ theme }) => theme.colors.clamPink};
`

export default function OttoPage() {
  const { t } = useTranslation()
  const { ottoId = '0' } = useParams()
  const { data, loading, refetch } = useQuery<GetOtto, GetOttoVariables>(GET_OTTO, {
    variables: { ottoId },
  })

  return (
    <Layout title={t('my_portals.title')}>
      <StyledOttoPage>
        {loading && <LoadingView />}
        {data && (
          <OttoContainer rawOtto={data.ottos[0]}>
            {({ otto, metadata }) => (
              <StyledOttoInfo>
                <StyledPortalImage src={metadata?.image} />
                <StyledContentContainer>
                  <StyledOpenSeaLink href={getOpenSeaLink(otto.tokenId)} target="_blank">
                    <Caption>{t('my_portals.opensea_link')}</Caption>
                  </StyledOpenSeaLink>
                  <StyledTitle>
                    <Display3>{metadata?.name}</Display3>
                  </StyledTitle>
                  <StyledDescription>
                    <ContentSmall>{metadata?.description}</ContentSmall>
                  </StyledDescription>
                </StyledContentContainer>
              </StyledOttoInfo>
            )}
          </OttoContainer>
        )}
      </StyledOttoPage>
    </Layout>
  )
}
