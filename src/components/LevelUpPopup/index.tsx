import AdventureFullscreen from 'components/AdventureFullscreen'
import AdventureProgressBar from 'components/AdventureProgressBar'
import AdventureRibbonText from 'components/AdventureRibbonText'
import Button from 'components/Button'
import CroppedImage from 'components/CroppedImage'
import RewardRibbonText from 'components/RewardRibbonText'
import TreasurySection from 'components/TreasurySection'
import { AdventureUIActionType, useAdventureUIState } from 'contexts/AdventureUIState'
import { useMyOtto } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentExtraSmall, Display1, Headline, Note } from 'styles/typography'
import silverImage from 'assets/chests/silver.png'
import goldenImage from 'assets/chests/golden.png'
import diamondImage from 'assets/chests/diamond.png'
import attributePointsImage from 'assets/chests/attribute_points.png'
import { AdventureDisplayedBoost, parseBoosts } from 'models/AdventureDisplayedBoost'
import { BoostType } from 'models/AdventureLocation'
import { useApi } from 'contexts/Api'
import MarkdownWithHtml from 'components/MarkdownWithHtml'
import arrowImage from './arrow.png'

const rewardItems: { [k: string]: { key: string; image: string } } = {
  16646144: {
    key: 'silver',
    image: silverImage.src,
  },
  16646208: {
    key: 'golden',
    image: goldenImage.src,
  },
  16646230: {
    key: 'diamond',
    image: diamondImage.src,
  },
}

const StyledFullscreen = styled(AdventureFullscreen)`
  position: relative;
  max-width: 375px !important;
  width: 80% !important;
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};

  .fullscreen-inner {
    padding: 40px 20px 20px;
  }
`

const StyledPopupTitle = styled(RewardRibbonText)`
  z-index: 1;
`

const StyledOtto = styled.div`
  display: flex;
  flex-direction: column;
  align-items: scratch;
`

const StyledLevels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const StyledLevel = styled(Display1)<{ levelUp?: boolean }>`
  font-size: 24px;
  ${({ levelUp, theme }) =>
    levelUp &&
    `
    color: ${theme.colors.crownYellow};
  `}
`

const StyledArrow = styled.span`
  display: block;
  width: ${arrowImage.width / 2}px;
  height: ${arrowImage.height / 2}px;
  background: center / cover url(${arrowImage.src});
`

const StyledTitle = styled(ContentExtraSmall)`
  text-align: center;
`

const StyledProgress = styled(Caption)`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  padding: 0 45px;
`

const StyledExpDetails = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledExpDiff = styled.div`
  color: ${({ theme }) => theme.colors.crownYellow};
`

const StyledExp = styled.div``

const StyledRewardSection = styled(TreasurySection)`
  width: 100%;
  margin-top: 20px;
  background: ${({ theme }) => theme.colors.darkGray400};
  padding: 0 15px 15px;
`

const StyledRewardTitle = styled.div`
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors.otterBlack};
  margin-top: -20px;
`

const StyledRewards = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`

const StyledReward = styled.div`
  flex: 1 50%;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledRewardLabel = styled(Note)``

const StyledRewardIcon = styled.div<{ image: string }>`
  width: 60px;
  height: 60px;
  background: center / cover url(${({ image }) => image});
`

const StyledBoosts = styled(Note).attrs({ as: 'div' })`
  padding-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export default function LevelUpPopup() {
  const api = useApi()
  const { t, i18n } = useTranslation('', { keyPrefix: 'levelUp' })
  const {
    state: { levelUp },
    dispatch,
  } = useAdventureUIState()
  const otto = useMyOtto(levelUp?.ottoId)
  const [boosts, setBoosts] = useState<string[]>([])

  const amounts = useMemo(() => {
    return (levelUp?.levelUp?.got.items ?? [])
      .filter(item => Boolean(rewardItems[item.tokenId]))
      .reduce((amounts, item) => {
        amounts[item.tokenId] = (amounts[item.tokenId] ?? 0) + 1
        return amounts
      }, {} as Record<string, number>)
  }, [levelUp?.levelUp?.got.items])

  const handleClose = useCallback(() => {
    dispatch({ type: AdventureUIActionType.LevelUp })
  }, [])

  const distributeAttributePoints = useCallback(() => {
    if (!levelUp) {
      return
    }

    handleClose()

    dispatch({
      type: AdventureUIActionType.DistributeAttributePoints,
      data: {
        ottoId: levelUp.ottoId,
        newLevel: levelUp.levelUp?.to.level,
      },
    })
  }, [levelUp])

  useEffect(() => {
    if (otto && otto.latestAdventurePass) {
      api
        .getOttoAdventurePreview(otto.id, otto.latestAdventurePass.locationId, [])
        .then(preview => parseBoosts(i18n, otto, preview.location.conditionalBoosts, false))
        .then(boosts => {
          const boost = boosts.find(({ boostType }) => boostType === BoostType.Exp)
          if (boost && boost.boostType === BoostType.Exp) {
            setBoosts(boost.currentLevelEffectiveBoosts)
          }
        })
    }
  }, [otto, api, i18n])

  return (
    <StyledFullscreen
      show={Boolean(levelUp)}
      onRequestClose={handleClose}
      bodyClassName="fullscreen-inner"
      header={<StyledPopupTitle text={t('popupTitle')} />}
    >
      {otto && levelUp?.levelUp && (
        <StyledContainer>
          <StyledOtto>
            <CroppedImage src={otto.image} width={140} height={140} />
            <StyledLevels>
              <StyledLevel>LV.{levelUp.levelUp.from.level}</StyledLevel>
              <StyledArrow />
              <StyledLevel levelUp>LV.{levelUp.levelUp.to.level}</StyledLevel>
            </StyledLevels>
            <StyledTitle>{otto.adventurerTitle}</StyledTitle>
          </StyledOtto>
          <StyledProgress>
            <StyledExpDetails>
              <StyledExpDiff>+{levelUp.rewards.exp} EXP</StyledExpDiff>
              <StyledExp>
                {levelUp.levelUp.from.exp}/{levelUp.levelUp.from.expToNextLevel} EXP
              </StyledExp>
            </StyledExpDetails>
            <AdventureProgressBar progress={1} />
          </StyledProgress>

          {boosts.length > 0 && (
            <StyledRewardSection showRope={false}>
              <StyledRewardTitle>
                <AdventureRibbonText>{t('boostSectionTitle')}</AdventureRibbonText>
              </StyledRewardTitle>
              <StyledBoosts>
                {boosts.map((boost, i) => (
                  <div dangerouslySetInnerHTML={{ __html: boost }} key={i} />
                ))}
              </StyledBoosts>
            </StyledRewardSection>
          )}

          <StyledRewardSection showRope={false}>
            <StyledRewardTitle>
              <AdventureRibbonText>{t('rewardSectionTitle')}</AdventureRibbonText>
            </StyledRewardTitle>
            <StyledRewards>
              {Object.entries(amounts).map(([tokenId]) => (
                <StyledReward key={tokenId}>
                  <StyledRewardIcon image={rewardItems[tokenId].image} />
                  <StyledRewardLabel>
                    {t(`itemRewardLabel.${rewardItems[tokenId].key}`, { amount: amounts[tokenId] })}
                  </StyledRewardLabel>
                </StyledReward>
              ))}
              <StyledReward>
                <StyledRewardIcon image={attributePointsImage.src} />
                <StyledRewardLabel>
                  {t('attributePointsRewardLabel', { points: levelUp.levelUp.got.attrs_points })}
                </StyledRewardLabel>
              </StyledReward>
            </StyledRewards>
          </StyledRewardSection>

          <Button width="100%" Typography={Headline} onClick={distributeAttributePoints}>
            {t('continueButton')}
          </Button>
        </StyledContainer>
      )}
    </StyledFullscreen>
  )
}
