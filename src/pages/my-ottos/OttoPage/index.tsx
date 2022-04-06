import { useQuery } from '@apollo/client'
import OpenSeaBlue from 'assets/opensea-blue.svg'
import { LoadingView } from 'components/LoadingView'
import { getOpenSeaLink } from 'constant'
import useOtto from 'hooks/useOtto'
import Layout from 'Layout'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentSmall, Display3, Headline } from 'styles/typography'
import Button from 'components/Button'
import { format } from 'date-fns'
import { GET_OTTO } from '../queries'
import { GetOtto, GetOttoVariables } from '../__generated__/GetOtto'
import GenderIcon from './icons/gender.png'
import PersonalityIcon from './icons/personality.png'
import BirthdayIcon from './icons/birthday.png'
import VoiceIcon from './icons/voice.png'
import PlayIcon from './icons/play-voice.svg'

const StyledOttoPage = styled.div`
  min-height: 100%;
  background: white;
  padding: 30px;
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledOttoContainer = styled.div`
  display: flex;
  gap: 30px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    align-items: center;
  }
`

const StyledLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const StyledOttoImage = styled.img`
  width: 440px;
  min-width: 440px;
  height: 440px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  background: url(/otto-loading.jpg);
  background-size: 100% 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    height: unset;
  }
`

const StyledPlayButtonText = styled(Headline)`
  display: flex;
  align-items: center;
  &:before {
    content: '';
    background-image: url(${PlayIcon});
    background-size: contain;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    display: block;
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

const StyledName = styled.p``

const StyledRarityScore = styled.p``

const StyledDescription = styled.p``

const StyledInfos = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`

const StyledInfo = styled.p<{ icon: string }>`
  display: flex;
  &:before {
    content: '';
    display: block;
    margin-right: 12px;
    background-image: url(${({ icon }) => icon});
    background-size: contain;
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
  }
`

const StyledAttrs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 118px);
  column-gap: 20px;
`

const StyledAttr = styled.div`
  display: flex;
  justify-content: space-between;
`

export default function OttoPage() {
  const { t } = useTranslation()
  const { ottoId = '0' } = useParams()
  const { data, loading } = useQuery<GetOtto, GetOttoVariables>(GET_OTTO, {
    variables: { ottoId },
  })
  const { loading: loadingOtto, otto } = useOtto(data?.ottos[0])
  const infos = useMemo(
    () =>
      otto
        ? [
            {
              icon: GenderIcon,
              text: t('otto.gender', { gender: otto.gender }),
            },
            {
              icon: PersonalityIcon,
              text: t('otto.personality', { personality: otto.personality }),
            },
            {
              icon: BirthdayIcon,
              text: t('otto.birthday', { birthday: format(otto.birthday, 'MMM dd, yyyy') }),
            },
            {
              icon: VoiceIcon,
              text: t('otto.voice', { voice: otto.voiceName }),
            },
          ]
        : null,
    [otto, t]
  )
  useEffect(() => {
    if (otto) setTimeout(() => otto?.playVoice(), 1000)
  }, [otto])

  return (
    <Layout title={t('my_portals.title')}>
      <StyledOttoPage>
        {(loading || loadingOtto) && <LoadingView />}
        {otto && (
          <StyledOttoContainer>
            <StyledLeftContainer>
              <StyledOttoImage src={otto.image} />
              <Button primaryColor="white" disableSound onClick={() => otto.playVoice()}>
                <StyledPlayButtonText>{t('otto.play_voice')}</StyledPlayButtonText>
              </Button>
            </StyledLeftContainer>
            <StyledContentContainer>
              <StyledOpenSeaLink href={getOpenSeaLink(otto.tokenId)} target="_blank">
                <Caption>{t('otto.opensea_link')}</Caption>
              </StyledOpenSeaLink>
              <StyledName>
                <Display3>{otto.name}</Display3>
              </StyledName>
              <StyledRarityScore>
                <Headline>{t('otto.rarity_score', { score: otto.baseRarityScore })}</Headline>
              </StyledRarityScore>
              <StyledInfos>
                {infos?.map(({ icon, text }, index) => (
                  <StyledInfo key={index} icon={icon}>
                    <ContentLarge>{text}</ContentLarge>
                  </StyledInfo>
                ))}
              </StyledInfos>
              <StyledDescription>
                <ContentSmall>{otto.description}</ContentSmall>
              </StyledDescription>

              <StyledAttrs>
                {otto?.metadata?.otto_attrs
                  ?.filter(p => p.trait_type !== 'BRS')
                  .map(({ trait_type, value }) => (
                    <StyledAttr>
                      <ContentLarge>{trait_type}</ContentLarge>
                      <ContentLarge>{value}</ContentLarge>
                    </StyledAttr>
                  ))}
              </StyledAttrs>
            </StyledContentContainer>
          </StyledOttoContainer>
        )}
      </StyledOttoPage>
    </Layout>
  )
}
