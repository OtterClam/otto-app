import AdventureFullscreen from "components/AdventureFullscreen";
import AdventureProgressBar from "components/AdventureProgressBar";
import AdventureRibbonText from "components/AdventureRibbonText";
import Button from "components/Button";
import CroppedImage from "components/CroppedImage";
import RewardRibbonText from "components/RewardRibbonText";
import TreasurySection from "components/TreasurySection";
import { useAdventureOtto } from "contexts/AdventureOttos";
import { AdventureUIActionType, useAdventureUIState } from "contexts/AdventureUIState";
import { useMyOttos } from "MyOttosProvider";
import { useCallback } from "react";
import styled from "styled-components/macro";
import { Caption, ContentExtraSmall, Display1, Headline } from "styles/typography";
import arrowImage from './arrow.png'

const StyledFullscreen = styled(AdventureFullscreen)`
  max-width: 375px !important;
  width: 80% !important;
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};

  .fullscreen-inner {
    padding: 40px 20px 20px;
  }
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
  ${({ levelUp, theme }) => levelUp && `
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
`

const StyledRewardTitle = styled.div`
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors.otterBlack};
  margin-top: -20px;
`

export default function LevelUpPopup() {
  const { state: { levelUp }, dispatch } = useAdventureUIState()
  const { ottos } = useMyOttos()
  const otto = ottos.find(otto => otto.tokenId === levelUp?.ottoId)
  const adventureOtto = useAdventureOtto(levelUp?.ottoId)
  const handleClose = useCallback(() => {
    dispatch({ type: AdventureUIActionType.LevelUp })
  }, [])

  return (
    <StyledFullscreen show={Boolean(levelUp)} onRequestClose={handleClose} bodyClassName="fullscreen-inner">
      {otto && adventureOtto && levelUp && (
        <StyledContainer>
          <RewardRibbonText text="LEVEL UP!!!" />
          <StyledOtto>
            <CroppedImage src={otto.image} width={140} height={140} />
            <StyledLevels>
              <StyledLevel>LV.{levelUp.levelUp.from.level}</StyledLevel>
              <StyledArrow />
              <StyledLevel levelUp>LV.{levelUp.levelUp.to.level}</StyledLevel>
            </StyledLevels>
            <StyledTitle>{adventureOtto.name}</StyledTitle>
          </StyledOtto>
          <StyledProgress>
            <StyledExpDetails>
              <StyledExpDiff>+50 EXP</StyledExpDiff>
              <StyledExp>{levelUp.levelUp.from.exp}/{levelUp.levelUp.from.expToNextLevel} EXP</StyledExp>
            </StyledExpDetails>
            <AdventureProgressBar progress={1} />
          </StyledProgress>
          <StyledRewardSection showRope={false}>
            <StyledRewardTitle>
              <AdventureRibbonText>Level-up Rewards</AdventureRibbonText>
            </StyledRewardTitle>
          </StyledRewardSection>
          <Button width="100%" Typography={Headline}>Continue</Button>
        </StyledContainer>
      )}
    </StyledFullscreen>
  )
}
