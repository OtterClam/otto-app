import Star from 'assets/ui/large-star.svg'
import Ribbon from 'assets/ui/ribbon.svg'
import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import ItemCell from 'components/ItemCell'
import { Mission } from 'models/Mission'
import { useTranslation } from 'next-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { Caption, ContentLarge, ContentMedium, ContentSmall, Headline } from 'styles/typography'
import FishIcon from 'assets/fish.png'
import Image from 'next/image'
import { ethers } from 'ethers'
import LevelIcon from './LevelIcon'
import FinishedStamp from './FinishedStamp'

const StyledCompleteMissionPopup = styled.div`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  height: calc(80vh);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 50px 108px;
  gap: 20px;
  overflow-x: hidden;
  overflow-y: auto;

  > * {
    position: relative;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 50px 20px;
  }
`

const StyledTitle = styled.section`
  text-align: center;
`

const StyledHeader = styled.div`
  position: relative;
`

const StyledFinishedStamp = styled(FinishedStamp)`
  position: absolute;
  top: 0;
  left: calc(100% - 200px);
`

const StyledResult = styled(ContentLarge)`
  text-align: center;
  color: ${({ theme }) => theme.colors.crownYellow};
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 40px;
  right: 40px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    top: 10px;
    right: 10px;
  }
`

const Spin = keyframes`
	from{transform:rotate(0deg)}
	to{transform:rotate(360deg)}
`

const StyledBackgroundContainer = styled.div`
  position: absolute;
  width: 908px;
  height: 908px;
  overflow: hidden;
  top: calc(40% - 454px);
  left: calc(50% - 454px);
`

const StyledBackground = styled.div`
  width: 908px;
  height: 908px;
  background: url(${Star.src}) no-repeat;
  background-size: 100% 100%;
  animation: ${Spin} 12s linear infinite;
`

const StyledRibbonText = styled.div`
  min-width: 223px;
  min-height: 53px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  background-image: url(${Ribbon.src});
  padding-top: 6px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding-top: 10px;
  }
`

const StyledItemList = styled.div<{ count: number }>`
  display: grid;
  justify-content: left;
  align-items: center;
  justify-items: center;
  gap: 20px;
  grid-template-columns: repeat(${({ count }) => (count > 5 ? 5 : count)}, 115px);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: repeat(${({ count }) => (count > 1 ? 2 : count)}, 115px);
  }
`

const StyledRewardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

interface Props {
  mission: Mission
  onClose: () => void
}

export default function CompleteMissionPopup({ mission, onClose }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'mission' })
  return (
    <Fullscreen>
      <StyledCompleteMissionPopup>
        <StyledBackgroundContainer>
          <StyledBackground />
        </StyledBackgroundContainer>
        <StyledTitle>
          <StyledHeader>
            <LevelIcon level={mission.level} />
            <StyledFinishedStamp color="white" />
          </StyledHeader>
          <ContentLarge as="h1">{mission.name}</ContentLarge>
          <Caption as="p">{mission.description}</Caption>
        </StyledTitle>
        <StyledResult>{mission.response}</StyledResult>
        <StyledRibbonText>
          <ContentSmall>{t('complete_reward')}</ContentSmall>
        </StyledRibbonText>
        <StyledItemList count={mission.rewards.length}>
          {mission.rewards.map((reward, index) => (
            <StyledRewardContainer key={index}>
              {reward.type === 'item' && (
                <>
                  <ItemCell item={reward.item} />
                  <ContentMedium>{reward.item.metadata.name}</ContentMedium>
                </>
              )}
              {reward.type === 'fish' && (
                <>
                  <Image src={FishIcon} width={115} height={115} />
                  <ContentMedium>{`${Number(ethers.utils.formatEther(reward.amount))} $FISH`}</ContentMedium>
                </>
              )}
            </StyledRewardContainer>
          ))}
        </StyledItemList>
        <Button Typography={Headline} onClick={onClose}>
          {t('close_btn')}
        </Button>
        <StyledCloseButton color="white" onClose={onClose} />
      </StyledCompleteMissionPopup>
    </Fullscreen>
  )
}
