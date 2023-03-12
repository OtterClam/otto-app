import { useEthers } from '@usedapp/core'
import ClassicIcon from 'assets/badge/classic.png'
import FirstGenIcon from 'assets/badge/first-gen.png'
import LegendaryIcon from 'assets/badge/legendary.png'
import Constellations from 'assets/constellations'
import OpenSeaBlue from 'assets/opensea-blue.svg'
import RankingIcon from 'assets/ranking.png'
import Button from 'components/Button'
import { DiceBanner } from 'components/DiceBanner'
import Loading from 'components/Loading'
import OttoThemeBoostLabels from 'components/OttoThemeBoostLabels'
import { getOpenSeaLink, reserveOttoAmount } from 'constant'
import { useLeaderboardEpoch } from 'contexts/LeaderboardEpoch'
import { format } from 'date-fns'
import useOtto from 'hooks/useOtto'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, ContentMedium, ContentSmall, Display3, Headline, Note } from 'styles/typography'
import { AdventureUIActionType, useAdventureUIState } from 'contexts/AdventureUIState'
import { useIsMyOttos } from 'MyOttosProvider'
import { useDispatch } from 'react-redux'
import { showOttoPopup } from 'store/uiSlice'
import { AdventureOttoStatus } from 'models/Otto'
import PlayIcon from './icons/play-voice.svg'
import Theme from './icons/theme.png'
import TheOtter from './icons/the_otter.png'
import OttoTraitDetails from './OttoTraitDetails'
import attributePointsImage from './icons/attribute-points.png'
import changeEquipmentIconImage from './icons/change-equipment.png'

const DicePopup = dynamic(() => import('components/DicePopup'), {
  ssr: false,
})

const AttrIconsMap = {
  STR: '/trait-icons/STR.png',
  DEF: '/trait-icons/DEF.png',
  DEX: '/trait-icons/DEX.png',
  INT: '/trait-icons/INT.png',
  LUK: '/trait-icons/LUK.png',
  CON: '/trait-icons/_CON.png',
  CUTE: '/trait-icons/CUTE.png',
};

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
  width: 80%;
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
    background-image: url(${PlayIcon.src});
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
    background-image: url(${OpenSeaBlue.src});
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
  align-items: center;
  justify-content: flex-start;
  grid-template-columns: repeat(2, 142px);
  column-gap: 40px;
`

const StyledAttr = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const StyledAttrIcon = styled.span<{ icon: string }>`
  display: flex;
  width: 30px;
  height: 30px;
  background-image: url(${({ icon }) => icon});
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 12px;
`

const StyledAttrLabel = styled.span`
  display: flex;
  justify-content: center;
`

const StyledAttributePoints = styled(ContentSmall).attrs({ as: 'div' })`
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    display: block;
    max-width: 36px;
    min-width: 36px;
    height: 36px;
    background: center / cover url(${attributePointsImage.src});
  }
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

const StyledStatTitle = styled(ContentSmall).attrs({ as: 'p' })``

const StyledStatDesc = styled(Note).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.darkGray100};
  text-align: center;
`

const StyledLegendaryBoost = styled(Note).attrs({ as: 'p' })`
  text-align: center;
  white-space: pre;
  color: ${({ theme }) => theme.colors.clamPink};
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
    background-image: url(${RankingIcon.src});
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

const StyledOttoThemeBoostLabels = styled(OttoThemeBoostLabels)`
  margin-top: 10px;
`

const StyledThemeBoostDesc = styled.div`
  display: inline-block;
`

const StyledChangeEquipmentButton = styled(Button)`
  width: 80%;
`

const StyledChangeEquipmentButtonText = styled(Headline)`
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    display: block;
    content: '';
    min-width: 20px;
    max-width: 20px;
    height: 20px;
    background: center / cover url(${changeEquipmentIconImage.src});
  }
`

export default function OttoPage() {
  const { t } = useTranslation()
  const {
    epoch: { themes },
  } = useLeaderboardEpoch()
  const { dispatch } = useAdventureUIState()
  const dispatchReduxAction = useDispatch()
  const { chainId } = useEthers()
  const router = useRouter()
  const ottoId = router.query.ottoId as string
  const { otto } = useOtto(ottoId, true)
  const isMyOtto = useIsMyOttos(ottoId)
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
              icon: Constellations[otto.zodiacSign],
              text: t('otto.zodiac_sign', { constellation: otto.zodiacSign }),
            },
            {
              icon: '/trait-icons/Level.png',
              text: t('otto.level', { level: otto.level }),
            },
          ]
        : null,
    [otto, t]
  )

  const openAttributePointsPopup = () => {
    dispatch({ type: AdventureUIActionType.DistributeAttributePoints, data: { ottoId } })
  }

  const openOttoPopup = () => {
    dispatchReduxAction(showOttoPopup(ottoId))
  }

  return (
    <>
      <StyledOttoPage>
        <StyledOttoContainer>
          <StyledLeftContainer>
            <StyledOttoImage src={otto?.image} />
            <StyledPlayButton
              primaryColor="white"
              Typography={StyledPlayButtonText}
              disableSound
              onClick={() => otto?.playVoice()}
            >
              {t('otto.play_voice')}
            </StyledPlayButton>
            {isMyOtto && (
              <StyledChangeEquipmentButton
                disabled={
                  !(
                    otto?.adventureStatus === AdventureOttoStatus.Ready ||
                    otto?.adventureStatus === AdventureOttoStatus.Resting
                  )
                }
                onClick={openOttoPopup}
                Typography={StyledChangeEquipmentButtonText}
              >
                {t('otto.change_equipment')}
              </StyledChangeEquipmentButton>
            )}
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

            {otto && (otto.zodiacBoost || 0) > 0 && (
              <StyledBoostBox>
                <img src={TheOtter.src} alt="the Otter" />
                <ContentSmall>
                  {t(otto?.isChosenOne ? 'otto.chosen_one' : 'otto.constellation_boost', {
                    birthday: format(otto.birthday, 'MMM d'),
                    constellation: otto.zodiacSign,
                  })}
                  <StyledBoost>BRS+{otto.zodiacBoost}!</StyledBoost>
                </ContentSmall>
              </StyledBoostBox>
            )}

            {otto && otto.themeBoost > 0 && (
              <StyledBoostBox>
                <img src={Theme.src} alt="the Otter" />
                <ContentSmall>
                  <StyledThemeBoostDesc
                    dangerouslySetInnerHTML={{
                      __html: t('otto.theme_boost', { labels: themes.map(theme => `#${theme}`).join(', ') }),
                    }}
                  />
                  <StyledBoost>BRS+{otto.themeBoost}</StyledBoost>
                  <StyledOttoThemeBoostLabels otto={otto} />
                </ContentSmall>
              </StyledBoostBox>
            )}

            {otto && <DiceBanner otto={otto} />}

            <StyledDescription>
              {!otto ? (
                <Loading width="100%" height="260px" />
              ) : (
                <ContentSmall>
                  <ReactMarkdown>{otto.description}</ReactMarkdown>
                </ContentSmall>
              )}
            </StyledDescription>

            <StyledStat>
              <StyledAttrs>
                {otto?.displayAttrs.map(({ trait_type, value }, index) => (
                  <StyledAttr key={trait_type}>
                    <StyledAttrLabel>
                      {AttrIconsMap[trait_type] && <StyledAttrIcon icon={AttrIconsMap[trait_type]} />}
                      {trait_type && <ContentLarge>{trait_type}</ContentLarge>}
                    </StyledAttrLabel>
                    <ContentLarge>{value}</ContentLarge>
                  </StyledAttr>
                ))}
              </StyledAttrs>
              {isMyOtto && (otto?.attributePoints || 0) > 0 && (
                <StyledAttributePoints>
                  {t('otto.attribute_points', { attributePoints: otto?.attributePoints ?? 0 })}
                  <Button
                    onClick={openAttributePointsPopup}
                    padding="0 12px"
                    Typography={ContentMedium}
                    disabled={!otto?.attributePoints}
                  >
                    {t('otto.attribute_points_button')}
                  </Button>
                </StyledAttributePoints>
              )}
            </StyledStat>

            {otto && (
              <>
                <StyledStatsContainer>
                  <StyledStat>
                    <StyledStatIcon src={otto.legendary ? LegendaryIcon.src : ClassicIcon.src} />
                    <StyledStatTitle>{t(otto.legendary ? 'otto.legendary' : 'otto.classic')}</StyledStatTitle>
                    <StyledStatDesc>{t(otto.legendary ? 'otto.legendary_note' : 'otto.classic_note')}</StyledStatDesc>
                    {Number(otto.id) >= reserveOttoAmount(chainId) && otto.legendary && (
                      <StyledLegendaryBoost>
                        {t('otto.legendary_boost', {
                          context: (otto.raw.legendary_boost || 0) > 0 ? 'added' : 'removed',
                        })}
                      </StyledLegendaryBoost>
                    )}
                  </StyledStat>
                  <StyledStat>
                    <StyledStatIcon src={`/arms/${otto.armsImage}.png`} />
                    <StyledStatTitle>{otto.coatOfArms}</StyledStatTitle>
                    <StyledStatDesc>{t('otto.coatOfArms', { arms: otto.coatOfArms })}</StyledStatDesc>
                  </StyledStat>
                  <StyledStat>
                    <StyledStatIcon src={FirstGenIcon.src} />
                    <StyledStatTitle>{t('otto.first_gen')}</StyledStatTitle>
                    <StyledStatDesc>{t('otto.first_gen_desc')}</StyledStatDesc>
                  </StyledStat>
                </StyledStatsContainer>
                <OttoTraitDetails otto={otto} />
              </>
            )}
          </StyledContentContainer>
        </StyledOttoContainer>
      </StyledOttoPage>
      <DicePopup />
    </>
  )
}
