import { useEthers } from '@usedapp/core'
import { useApiCall } from 'contexts/Api'
import { Api, MissionFilter } from 'libs/api'
import noop from 'lodash/noop'
import { Mission, MissionInfo } from 'models/Mission'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface MyMissions {
  loading: boolean
  info?: MissionInfo
  missions: Mission[]
  newMission: Mission | null
  filter: MissionFilter
  setFilter: (filter: MissionFilter) => void
  setNewMission: (mission: Mission | null) => void
  reload: () => void
}

export const MyMissionsContext = createContext<MyMissions>({
  loading: false,
  missions: [],
  newMission: null,
  filter: 'ongoing',
  setFilter: noop,
  reload: noop,
  setNewMission: noop,
})

export function useMyMissions() {
  return useContext(MyMissionsContext)
}

export default function MyMissionsProvider({ children }: PropsWithChildren<any>) {
  const { account } = useEthers()
  const [filter, setFilter] = useState<MissionFilter>('ongoing')
  const [newMission, setNewMission] = useState<Mission | null>(null)
  const { fetch: getInfo, result: info } = useApiCall(
    'getMissionInfo',
    useMemo(() => [{ account: account ?? '' }], [account])
  )
  useEffect(() => {
    if (account) {
      getInfo()
    }
  }, [account, getInfo])
  const { fetch: listMissions, result: missions = [] } = useApiCall(
    'listMissions',
    useMemo(() => [{ account: account ?? '', filter }], [account, filter])
  )
  useEffect(() => {
    if (account) {
      listMissions()
    }
  }, [account, listMissions])
  const myMissions: MyMissions = useMemo(
    () => ({
      loading: false,
      info,
      missions,
      newMission,
      filter,
      setFilter,
      reload: listMissions,
      setNewMission: (mission: Mission | null) => {
        setNewMission(mission)
        if (mission) {
          listMissions()
        }
      },
    }),
    [filter, info, missions, newMission, listMissions]
  )
  return <MyMissionsContext.Provider value={myMissions}>{children}</MyMissionsContext.Provider>
}
