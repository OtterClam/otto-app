import { useEthers } from '@usedapp/core'
import { useApiCall } from 'contexts/Api'
import noop from 'lodash/noop'
import Otto from 'models/Otto'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react'

interface MyOttos {
  loading: boolean
  ottos: Otto[]
  reload: () => Promise<void>
  updateOtto: (otto: Otto) => void
}

export const MyOttosContext = createContext<MyOttos>({
  loading: true,
  ottos: [],
  reload: () => {
    return Promise.resolve()
  },
  updateOtto: noop,
})

export function useMyOttos() {
  const { loading, ottos, reload, updateOtto } = useContext(MyOttosContext)
  return { loading, ottos, reload, updateOtto }
}

export function useIsMyOttos(ottoTokenId?: string): boolean {
  const { ottos } = useMyOttos()
  return useMemo(() => {
    return Boolean(ottos.find(otto => otto.id === ottoTokenId))
  }, [ottos, ottoTokenId])
}

// this component must to be wrapped by AdventureOttosProvider
export default function MyOttosProvider({ children }: PropsWithChildren<any>) {
  const { account } = useEthers()
  const { loading, result, refetch } = useApiCall('getAdventureOttos', [account ?? ''], Boolean(account), [account])
  const ottos = result ?? []
  const updateOtto = useCallback(
    (otto: Otto) => {
      const idx = ottos.findIndex(o => o.id === otto.id)
      if (idx >= 0) {
        ottos[idx] = otto
      } else {
        console.warn(`updateOtto: otto ${otto.id} not found`)
      }
    },
    [ottos]
  )
  const myOttos = useMemo(
    () => ({
      loading,
      ottos,
      reload: refetch,
      updateOtto,
    }),
    [loading, ottos, refetch, updateOtto]
  )

  return <MyOttosContext.Provider value={myOttos}>{children}</MyOttosContext.Provider>
}
