import styled from 'styled-components/macro'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import Switcher from 'components/Switcher'
import { Note } from 'styles/typography'
import { Mission } from 'models/Mission'
import { RawItemMetadata, rawItemMetadataToItemMetadata } from 'models/Item'
import { useApi, useApiCall } from 'contexts/Api'
import { MissionFilter } from 'libs/api'
import { useEthers } from '@usedapp/core'
import MissionCard from './MissionCard'
import NewMissionPopup from './NewMissionPopup'

const StyledMissionList = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.lightGray300};
  color: ${({ theme }) => theme.colors.otterBlack};
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const filters: { label: string; value: MissionFilter }[] = [
  { label: 'ongoing', value: 'ongoing' },
  { label: 'finished', value: 'finished' },
]

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledSwitcher = styled(Switcher)``

export default function MissionList() {
  const { t } = useTranslation('', { keyPrefix: 'mission' })
  const { account } = useEthers()
  const [filter, setFilter] = useState<MissionFilter>('ongoing')
  const { result: missions = [] } = useApiCall('listMissions', [{ account: account ?? '', filter }], Boolean(account), [
    account,
    filter,
  ])
  const [mission, setMission] = useState<Mission | null>(null)
  return (
    <StyledMissionList>
      <StyledHeader>
        <StyledSwitcher name="filter" value={filter} options={filters} onChange={value => setFilter(value as any)} />
        <Note>{t('ongoingCap', { current: 4, max: 6 })}</Note>
      </StyledHeader>
      {missions.map(mission => (
        <MissionCard key={mission.id} mission={mission} onClick={() => setMission(mission)} />
      ))}
      {/* {mission && <NewMissionPopup mission={mission} />} */}
    </StyledMissionList>
  )
}
