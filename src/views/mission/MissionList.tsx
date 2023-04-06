import Switcher from 'components/Switcher'
import { useMyItems } from 'contexts/MyItems'
import { MissionFilter } from 'libs/api'
import { Item } from 'models/Item'
import { useMyOttos } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import MissionCard from './MissionCard'
import { useMyMissions } from './MyMissionsProvider'

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
  const { missions, filter, setFilter } = useMyMissions()
  const { ottos: myOttos } = useMyOttos()
  const { items: myItems } = useMyItems()
  const myItemMap: Record<string, Item> = useMemo(
    () =>
      myItems.reduce(
        (acc, item) => ({
          ...acc,
          [item.metadata.tokenId]: item,
        }),
        {}
      ),
    [myItems]
  )
  return (
    <StyledMissionList>
      <StyledHeader>
        <StyledSwitcher name="filter" value={filter} options={filters} onChange={value => setFilter(value as any)} />
        <Note>{t('ongoingCap', { current: missions.length, max: myOttos.length })}</Note>
      </StyledHeader>
      {missions.map(mission => (
        <MissionCard key={mission.id} mission={mission} myItems={myItemMap} />
      ))}
    </StyledMissionList>
  )
}
