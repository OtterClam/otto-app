import { useEthers } from '@usedapp/core'
import { useApiCall } from 'contexts/Api'
import { MissionFilter } from 'libs/api'
import noop from 'lodash/noop'
import { Mission, MissionInfo } from 'models/Mission'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'

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
  const { result: info } = useApiCall('getMissionInfo', [{ account: account ?? '' }], Boolean(account), [account])
  const [filter, setFilter] = useState<MissionFilter>('ongoing')
  const [newMission, setNewMission] = useState<Mission | null>(null)
  const { result: missions = [], refetch } = useApiCall(
    'listMissions',
    [{ account: account ?? '', filter }],
    Boolean(account),
    [account, filter]
  )
  const reload = useCallback(() => {
    refetch()
  }, [refetch])
  const myMissions: MyMissions = useMemo(
    () => ({
      loading: false,
      info,
      missions,
      newMission,
      filter,
      setFilter,
      reload,
      setNewMission: (mission: Mission | null) => {
        setNewMission(mission)
        if (mission) {
          reload()
        }
      },
    }),
    [filter, info, missions, newMission, reload]
  )
  return <MyMissionsContext.Provider value={myMissions}>{children}</MyMissionsContext.Provider>
}
