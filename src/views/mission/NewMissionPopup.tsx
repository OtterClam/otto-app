import FishIcon from 'assets/fish.png'
import Button from 'components/Button'
import Fullscreen from 'components/Fullscreen'
import ItemCell from 'components/ItemCell'
import { ethers } from 'ethers'
import { Mission } from 'models/Mission'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, ContentSmall, Headline, Note } from 'styles/typography'
import LevelIcon from './LevelIcon'
import NewMissionTitle from './new-mission-title.png'

const StyledNewMissionPopup = styled.div`
  max-width: 428px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  overflow: hidden;
  padding: 18px 30px;
`

const StyledTitle = styled(Headline).attrs({ as: 'h1' })`
  color: white;
`

const NewMissionTitleImage = styled.div`
  position: absolute;
  top: 24px;
  right: 50px;
`

const StyledMissionCard = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.lightGray400};
  border-radius: 10px;
  overflow: hidden;
`

const StyledHeader = styled.section`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
`

const StyledTitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const StyledExpandedArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px 20px;
  gap: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray400};
`

const StyledMissionDesc = styled(Caption).attrs({ as: 'p' })`
  text-align: left;
`

const StyledSubtitle = styled(Note)`
  color: ${({ theme }) => theme.colors.darkGray200};
`

const StyledItemRewardCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

interface Props {
  mission: Mission | null
  onClose: () => void
}

export default function NewMissionPopup({ mission, onClose }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'mission' })
  return (
    <Fullscreen width="428px" show={Boolean(mission)}>
      {mission && (
        <StyledNewMissionPopup>
          <StyledTitle>{t('new_mission_title')}</StyledTitle>
          <NewMissionTitleImage>
            <Image src={NewMissionTitle} width="65px" height="42px" />
          </NewMissionTitleImage>
          <StyledMissionCard>
            <StyledHeader>
              <LevelIcon level={mission.level} />
              <StyledTitleContainer>
                <ContentSmall>{mission.name}</ContentSmall>
              </StyledTitleContainer>
            </StyledHeader>
            <StyledExpandedArea>
              <StyledMissionDesc>{mission.description}</StyledMissionDesc>
              <StyledSubtitle>{t('required_items')}</StyledSubtitle>
              {mission.requirements.map((req, i) => (
                <StyledItemRewardCell key={i}>
                  <ItemCell item={req.item} size={58} />
                  <ContentSmall>{req.item.metadata.name}</ContentSmall>
                  <ContentSmall>x{req.amount}</ContentSmall>
                </StyledItemRewardCell>
              ))}
              <StyledSubtitle>{t('reward')}</StyledSubtitle>
              {mission.rewards.map((reward, i) => (
                <StyledItemRewardCell key={i}>
                  {reward.type === 'fish' && (
                    <>
                      <Image src={FishIcon} width={58} height={58} />
                      <ContentSmall>
                        {Number(ethers.utils.formatUnits(reward.amount, reward.decimal))} FISH
                      </ContentSmall>
                    </>
                  )}
                  {reward.type === 'item' && (
                    <>
                      <ItemCell item={reward.item} size={58} />
                      <ContentSmall>{reward.item.metadata.name}</ContentSmall>
                      <ContentSmall>x{reward.amount}</ContentSmall>
                    </>
                  )}
                </StyledItemRewardCell>
              ))}
            </StyledExpandedArea>
          </StyledMissionCard>
          <Button Typography={ContentLarge} width="100%" onClick={onClose}>
            {t('ok_btn')}
          </Button>
        </StyledNewMissionPopup>
      )}
    </Fullscreen>
  )
}
