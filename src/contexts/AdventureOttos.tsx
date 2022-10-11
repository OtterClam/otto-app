import { useEthers } from '@usedapp/core'
import Otto from 'models/Otto'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { useApi, useApiCall } from './Api'

export interface AdventureOttoState {
  refetch: () => Promise<void>
  ottos: Otto[]
  loading: boolean
}

const AdventureOttosContext = createContext<AdventureOttoState>({
  refetch: () => Promise.resolve(),
  ottos: [],
  loading: true,
})

export const AdventureOttosProvider = ({ children }: PropsWithChildren<object>) => {
  const api = useApi()
  const { account } = useEthers()
  const {
    loading,
    result: ottos,
    refetch,
  } = useApiCall('getAdventureOttos', [account ?? ''], Boolean(account), [account])
  const value = useMemo(
    () => ({
      ottos: ottos ?? [],
      refetch,
      loading,
    }),
    [api, ottos, loading]
  )

  useEffect(() => {
    let timer: number

    const updateOttos = () => {
      refetch()
      setTimeout(() => {
        updateOttos()
      }, 10000)
    }

    // updateOttos()

    return () => {
      clearTimeout(timer)
    }
  }, [api])

  return <AdventureOttosContext.Provider value={value}>{children}</AdventureOttosContext.Provider>
}

export const useAdventureOttos = () => {
  return useContext(AdventureOttosContext)
}
