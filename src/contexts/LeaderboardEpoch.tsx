import { throttle } from 'lodash'
import noop from 'lodash/noop'
import { LeaderboardEpoch } from 'models/LeaderboardEpoch'
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useApi } from './Api'

const defaultEpoch: LeaderboardEpoch = {
  num: 0,
  totalOttos: 0,
  startedAt: new Date(0),
  endedAt: new Date(0),
  themes: [],
}

const LeaderboardEpochContext = createContext<{
  epoch: LeaderboardEpoch
  loading: boolean
  refetch: () => void
}>({
  loading: false,
  epoch: defaultEpoch,
  refetch: noop,
})

export const LeaderboardEpochProvider = ({ children }: PropsWithChildren<object>) => {
  const api = useApi()
  const [loading, setLoading] = useState(true)
  const [epoch, setEpoch] = useState<LeaderboardEpoch>(defaultEpoch)

  const refetch = useMemo(() => {
    return throttle(() => {
      setLoading(true)
      api
        .getLeaderBoardEpoch()
        .then(setEpoch)
        .finally(() => setLoading(false))
    }, 500)
  }, [api])

  const value = useMemo(
    () => ({
      loading,
      epoch,
      refetch,
    }),
    [loading, epoch, api]
  )

  useEffect(refetch, [api])

  return <LeaderboardEpochContext.Provider value={value}>{children}</LeaderboardEpochContext.Provider>
}

export const useLeaderboardEpoch = () => {
  return useContext(LeaderboardEpochContext)
}

export const useThemeMatcher = () => {
  const { epoch } = useLeaderboardEpoch()

  const themesMap = useMemo(() => {
    return epoch.themes.reduce((map, theme) => Object.assign(map, { [theme]: 1 }), {} as { [k: string]: number })
  }, [epoch])

  return useCallback(
    (label: string) => {
      return Boolean(themesMap[label])
    },
    [themesMap]
  )
}
