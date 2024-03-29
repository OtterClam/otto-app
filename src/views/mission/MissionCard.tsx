import MaticIcon from 'assets/tokens/WMATIC.svg'
import FishIcon from 'assets/fish.png'
import ArrowDown from 'assets/ui/arrow_down.svg'
import RefreshIcon from 'assets/ui/refresh_icon.svg'
import Button from 'components/Button'
import ItemCell from 'components/ItemCell'
import { useCompleteMission, useRefreshMission } from 'contracts/functions'
import { ethers } from 'ethers'
import { Item } from 'models/Item'
import { Mission, MissionReward } from 'models/Mission'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentSmall, Note } from 'styles/typography'
import FinishedStamp from './FinishedStamp'
import LevelIcon from './LevelIcon'
import { useMyMissions } from './MyMissionsProvider'

const CompleteMissionPopup = dynamic(() => import('./CompleteMissionPopup'))

const StyledMissionCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.lightGray400};
  border-radius: 10px;
  overflow: hidden;
  &:hover {
    background: ${({ theme }) => theme.colors.lightGray100};
  }
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

const StyledRequired = styled(Note)<{ fulfilled: boolean }>`
  color: ${({ theme, fulfilled }) => (fulfilled ? theme.colors.otterBlue : theme.colors.otterBlack)};
  span {
    color: ${({ theme, fulfilled }) => (fulfilled ? theme.colors.otterBlue : theme.colors.clamPink)};
  }
`

const StyledStatus = styled(ContentSmall).attrs({ as: 'p' })`
  background: ${({ theme }) => theme.colors.lightGray200};
  border-radius: 10px;
  padding: 5px 10px;
`

const StyledCompactRewards = styled.div`
  position: relative;
  display: flex;
  gap: 5px;
  padding: 5px 20px;
  background: ${({ theme }) => theme.colors.lightGray100};
  ${StyledMissionCard}:hover & {
    background: ${({ theme }) => theme.colors.lightGray200};
  }
`

const StyledExpandedButton = styled.button<{ expanded: boolean }>`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 20px;
  transform: rotate(${({ expanded }) => (expanded ? '180deg' : 0)});
  transform-origin: center;
  transition-property: transform;
  transition: 300ms;
`

const StyledExpandedArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px 20px;
  gap: 10px;
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

const StyledRequiredNumber = styled(ContentSmall)<{ fulfill: boolean }>`
  color: ${({ fulfill, theme }) => (fulfill ? theme.colors.otterBlack : theme.colors.clamPink)};
`

const StyledRefreshContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
`

const StyledRefreshButton = styled.button`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.lightGray200};
  border-radius: 4px;
  padding: 5px;
  gap: 5px;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray300};
  }
`

const StyledAward = styled(Note)<{ reward: MissionReward }>`
  display: flex;
  align-items: center;
  &:before {
    content: '';
    background: no-repeat center/contain
      url(${({ reward }) => (reward.type === 'fish' ? FishIcon.src : reward.item.metadata.image)});
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }
`

interface Props {
  mission: Mission
  myItems: Record<string, Item>
}

export default function MissionCard({ mission, myItems }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'mission' })
  const { info, reload, setNewMission } = useMyMissions()
  const [expanded, setExpanded] = useState(false)
  const totalRequiredAmount = mission.requirements.reduce((acc, cur) => acc + cur.amount, 0)
  const hasAmount = mission.requirements.reduce(
    (acc, cur) => acc + Math.min(myItems[cur.item.id]?.amount || 0, cur.amount),
    0
  )
  const fulfilled = hasAmount === totalRequiredAmount
  const { complete, completeMissionState, resetCompleteMission } = useCompleteMission()
  const { refresh, refreshState, resetRefresh } = useRefreshMission(mission.id)
  useEffect(() => {
    if (completeMissionState.state === 'Fail') {
      alert(completeMissionState.status.errorMessage)
      resetCompleteMission()
    }
  }, [completeMissionState, resetCompleteMission])
  useEffect(() => {
    if (refreshState.state === 'Fail') {
      alert(refreshState.status.errorMessage)
      resetRefresh()
    } else if (refreshState.state === 'Success' && refreshState.mission) {
      setNewMission(refreshState.mission)
      resetRefresh()
    }
  }, [refreshState, resetRefresh, setNewMission])
  return (
    <StyledMissionCard onClick={() => setExpanded(expanded => !expanded)}>
      <StyledHeader>
        <LevelIcon level={mission.level} />
        <StyledTitleContainer>
          <ContentSmall>{mission.name}</ContentSmall>
          <StyledRequired fulfilled={fulfilled}>
            {t('require_desc')}
            <span>
              ({hasAmount}/{totalRequiredAmount})
            </span>
          </StyledRequired>
        </StyledTitleContainer>
        {mission.status === 'ongoing' && !fulfilled && <StyledStatus>{t('ongoing')}</StyledStatus>}
        {mission.status === 'ongoing' && fulfilled && (
          <Button
            Typography={ContentSmall}
            padding="6px 6px"
            loading={completeMissionState.state === 'Processing'}
            onClick={() => complete(mission.id)}
          >
            {t('complete_btn')}
          </Button>
        )}
        {mission.status === 'finished' && <FinishedStamp />}
      </StyledHeader>
      <StyledCompactRewards>
        <Note>{t('awards')}</Note>
        {mission.rewards.map((reward, i) => (
          <StyledAward key={i} reward={reward}>
            x{reward.type === 'fish' ? Number(ethers.utils.formatUnits(reward.amount, reward.decimal)) : reward.amount}
          </StyledAward>
        ))}
        <StyledExpandedButton
          expanded={expanded}
          onClick={e => {
            e.stopPropagation()
            setExpanded(expanded => !expanded)
          }}
        >
          <Image src={ArrowDown} width="16px" height="16px" />
        </StyledExpandedButton>
      </StyledCompactRewards>
      {expanded && (
        <StyledExpandedArea>
          <StyledMissionDesc>{mission.description}</StyledMissionDesc>
          <StyledSubtitle>{t('required_items')}</StyledSubtitle>
          {mission.requirements.map((req, i) => (
            <StyledItemRewardCell key={i}>
              <ItemCell item={req.item} size={58} />
              <ContentSmall>{req.item.metadata.name}</ContentSmall>
              <StyledRequiredNumber fulfill={(myItems[req.item.id]?.amount || 0) >= req.amount}>{`(${
                myItems[req.item.id]?.amount || 0
              }/${req.amount})`}</StyledRequiredNumber>
            </StyledItemRewardCell>
          ))}
          <StyledSubtitle>{t('reward')}</StyledSubtitle>
          {mission.rewards.map((reward, i) => (
            <StyledItemRewardCell key={i}>
              {reward.type === 'fish' && (
                <>
                  <Image src={FishIcon} width={58} height={58} />
                  <ContentSmall>FISH</ContentSmall>
                  <ContentSmall>x{Number(ethers.utils.formatUnits(reward.amount, reward.decimal))}</ContentSmall>
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
          {mission.status === 'ongoing' && (
            <StyledRefreshContainer>
              <StyledSubtitle>{t('refresh_desc')}</StyledSubtitle>
              <StyledRefreshButton
                onClick={e => {
                  e.stopPropagation()
                  if (info) {
                    refresh(info.refresh_matic_payment_key, info.refresh_matic_price)
                  }
                }}
              >
                <Image src={RefreshIcon} width="20px" height="20px" />
                <Note>{t('refresh_btn')}</Note>
                <Image src={MaticIcon} width="20px" height="20px" />
                <Note>1</Note>
              </StyledRefreshButton>
            </StyledRefreshContainer>
          )}
        </StyledExpandedArea>
      )}
      {completeMissionState.state === 'Success' && (
        <CompleteMissionPopup
          mission={mission}
          onClose={() => {
            resetCompleteMission()
            reload()
          }}
        />
      )}
    </StyledMissionCard>
  )
}
