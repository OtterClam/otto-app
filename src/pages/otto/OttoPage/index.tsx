import { useQuery } from '@apollo/client'
import OpenSeaBlue from 'assets/opensea-blue.svg'
import Button from 'components/Button'
import Loading from 'components/Loading'
import { getOpenSeaLink } from 'constant'
import { format } from 'date-fns'
import useOtto from 'hooks/useOtto'
import Layout from 'Layout'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, ContentSmall, Display3, Headline, Note } from 'styles/typography'
import RankingIcon from 'assets/ranking.png'
import { GET_OTTO } from '../queries'
import { GetOtto, GetOttoVariables } from '../__generated__/GetOtto'
import ClassicIcon from './badge/classic.png'
import LegendaryIcon from './badge/legendary.png'
import FirstGenIcon from './badge/first-gen.png'
import PlayIcon from './icons/play-voice.svg'
import OttoTraitDetails from './OttoTraitDetails'
import TheOtter from './icons/the_otter.png'

const StyledOttoPage = styled.div`
  min-height: 100%;
  background: white;
  padding: 30px;
  color: ${({ theme }) => theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 20px;
  }
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
  position: sticky;
  top: 30px;
  width: 440px;
  min-width: 440px;
  height: 440px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  background: url(/otto-loading.jpg);
  background-size: 100% 100%;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    min-width: unset;
    height: unset;
    position: unset;
  }
`

const StyledPlayButton = styled(Button)`
  position: sticky;
  top: 490px;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    position: unset;
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

const StyledName = styled.div``

const StyledRarityScore = styled.div``

const StyledDescription = styled.div``

const StyledInfos = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`

const StyledInfo = styled.div<{ icon: string }>`
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

const StyledStatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: flex;
    flex-direction: column;
  }
`

const StyledStat = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 15px;
  background: ${({ theme }) => theme.colors.lightGray100};
  padding: 20px;
`

const StyledStatIcon = styled.img`
  width: 49px;
`

const StyledStatTitle = styled.p``

const StyledStatDesc = styled.p`
  color: ${({ theme }) => theme.colors.darkGray100};
  text-align: center;
`

const StyledRarityContainer = styled(Headline).attrs({ as: 'div' })`
  display: flex;
  gap: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`

const StyledRanking = styled(Headline).attrs({
  as: 'div',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  &:before {
    content: '';
    width: 24px;
    height: 24px;
    background-image: url(${RankingIcon});
    background-size: 100%;
  }
`

const StyledBoostBox = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 20px;
  background: ${({ theme }) => theme.colors.lightGray100};
  border: 2px solid ${({ theme }) => theme.colors.lightGray400};
  border-radius: 15px;
  white-space: pre;

  img {
    width: 80px;

    @media ${({ theme }) => theme.breakpoints.mobile} {
      width: 80px;
    }
  }
`

const StyledBoost = styled.span`
  color: ${({ theme }) => theme.colors.clamPink};
  margin-left: 10px;
`

export default function OttoPage() {
  const { t } = useTranslation()
  const { ottoId = '0' } = useParams()
  const { data } = useQuery<GetOtto, GetOttoVariables>(GET_OTTO, {
    variables: { ottoId },
  })
  const { otto } = useOtto(data?.ottos[0], true)
  const infos = useMemo(
    () =>
      otto
        ? [
            {
              icon: '/trait-icons/Gender.png',
              text: t('otto.gender', { gender: otto.gender }),
            },
            {
              icon: '/trait-icons/Personality.png',
              text: t('otto.personality', { personality: otto.personality }),
            },
            {
              icon: '/trait-icons/Birthday.png',
              text: t('otto.birthday', { birthday: format(otto.birthday, 'MMM dd, yyyy') }),
            },
            {
              icon: '/trait-icons/Voice.png',
              text: t('otto.voice', { voice: otto.voiceName }),
            },
            {
              icon: '/trait-icons/Constellation.png',
              text: t('otto.zodiac_sign', { constellation: otto.constellation }),
            },
          ]
        : null,
    [otto, t]
  )

  useEffect(() => {
    if (otto) setTimeout(() => otto?.playVoice(), 1000)
  }, [otto])

  return (
    <Layout title={t('otto.title')}>
      <StyledOttoPage>
        <StyledOttoContainer>
          <StyledLeftContainer>
            <StyledOttoImage src={otto?.image} />
            <StyledPlayButton primaryColor="white" disableSound onClick={() => otto?.playVoice()}>
              <StyledPlayButtonText>{t('otto.play_voice')}</StyledPlayButtonText>
            </StyledPlayButton>
          </StyledLeftContainer>
          <StyledContentContainer>
            <StyledOpenSeaLink href={getOpenSeaLink(ottoId)} target="_blank">
              <Caption>{t('otto.opensea_link')}</Caption>
            </StyledOpenSeaLink>
            <StyledName>
              {!otto ? <Loading width="320px" height="54px" /> : <Display3>{otto.name}</Display3>}
            </StyledName>
            <StyledRarityScore>
              {!otto ? (
                <Loading width="260px" height="36px" />
              ) : (
                <StyledRarityContainer>
                  {t('otto.rarity_score', {
                    score: otto.totalRarityScore,
                    brs: otto.baseRarityScore,
                    rrs: otto.relativeRarityScore,
                  })}
                  <StyledRanking>{otto.ranking}</StyledRanking>
                </StyledRarityContainer>
              )}
            </StyledRarityScore>
            <StyledInfos>
              {infos?.map(({ icon, text }, index) => (
                <StyledInfo key={index} icon={icon}>
                  <ContentLarge>{text}</ContentLarge>
                </StyledInfo>
              ))}
            </StyledInfos>
            {otto && (otto.raw.constellationBoost || 0) > 0 && (
              <StyledBoostBox>
                <img src={TheOtter} alt="the Otter" />
                <ContentSmall>
                  {t(otto?.raw.constellationBoost === 150 ? 'otto.chosen_one' : 'otto.constellation_boost', {
                    birthday: format(otto.birthday, 'MMM d'),
                    constellation: otto.constellation,
                  })}
                  <StyledBoost>BRS+{otto.raw.constellationBoost}!</StyledBoost>
                </ContentSmall>
              </StyledBoostBox>
            )}
            <StyledDescription>
              {!otto ? (
                <Loading width="100%" height="260px" />
              ) : (
                <ContentSmall>
                  <ReactMarkdown>{otto.description}</ReactMarkdown>
                </ContentSmall>
              )}
            </StyledDescription>

            <StyledAttrs>
              {otto?.displayAttrs.map(({ trait_type, value }, index) => (
                <StyledAttr key={index}>
                  <ContentLarge>{trait_type}</ContentLarge>
                  <ContentLarge>{value}</ContentLarge>
                </StyledAttr>
              ))}
            </StyledAttrs>

            {otto && (
              <>
                <StyledStatsContainer>
                  <StyledStat>
                    <StyledStatIcon src={otto.legendary ? LegendaryIcon : ClassicIcon} />
                    <StyledStatTitle>
                      <ContentSmall>{t(otto.legendary ? 'otto.legendary' : 'otto.classic')}</ContentSmall>
                    </StyledStatTitle>
                    <StyledStatDesc>
                      <Note>{t(otto.legendary ? 'otto.legendary_note' : 'otto.classic_note')}</Note>
                    </StyledStatDesc>
                  </StyledStat>
                  <StyledStat>
                    <StyledStatIcon src={`/arms/${otto.armsImage}.png`} />
                    <StyledStatTitle>
                      <ContentSmall>{otto.coatOfArms}</ContentSmall>
                    </StyledStatTitle>
                    <StyledStatDesc>
                      <Note>{t('otto.coatOfArms', { arms: otto.coatOfArms })}</Note>
                    </StyledStatDesc>
                  </StyledStat>
                  <StyledStat>
                    <StyledStatIcon src={FirstGenIcon} />
                    <StyledStatTitle>
                      <ContentSmall>{t('otto.first_gen')}</ContentSmall>
                    </StyledStatTitle>
                    <StyledStatDesc>
                      <Note>{t('otto.first_gen_desc')}</Note>
                    </StyledStatDesc>
                  </StyledStat>
                </StyledStatsContainer>
                <OttoTraitDetails otto={otto} />
              </>
            )}
          </StyledContentContainer>
        </StyledOttoContainer>
      </StyledOttoPage>
    </Layout>
  )
}
