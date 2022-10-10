import { useEthers } from '@usedapp/core'
import { AdventureOtto } from 'models/AdventureOtto'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { useApi, useApiCall } from './Api'

export interface AdventureOttoState {
  refetch: () => Promise<void>
  ottos: AdventureOtto[]
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

  console.log('ottos', ottos)

  const value = useMemo(
    () => ({
      ottos: (ottos ?? []).filter(otto => otto.imageWoBg),
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

export const useAdventureOtto = (ottoId?: string) => {
  const { ottos } = useAdventureOttos()
  return ottos.find(otto => String(otto.id) === ottoId)
}
