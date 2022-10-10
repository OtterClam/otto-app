import { useAdventureOttos } from 'contexts/AdventureOttos'
import Otto from 'models/Otto'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react'

interface MyOttos {
  loading: boolean
  ottos: Otto[]
  reload: () => Promise<void>
}

export const MyOttosContext = createContext<MyOttos>({
  loading: true,
  ottos: [],
  reload: () => {
    return Promise.resolve()
  },
})

export function useMyOttos() {
  const { loading, ottos, reload } = useContext(MyOttosContext)
  return { loading, ottos, reload }
}

export function useIsMyOttos(ottoTokenId?: string): boolean {
  const { ottos } = useMyOttos()
  return useMemo(() => {
    return Boolean(ottos.find(otto => otto.id === ottoTokenId))
  }, [ottos, ottoTokenId])
}

// this component must to be wrapped by AdventureOttosProvider
export default function MyOttosProvider({ children }: PropsWithChildren<any>) {
  const { ottos, refetch: refetchAdventureOttos, loading } = useAdventureOttos()
  const reload = useCallback(() => {
    return refetchAdventureOttos()
  }, [refetchAdventureOttos])

  const myOttos = useMemo(
    () => ({
      loading,
      ottos,
      reload,
    }),
    [loading, ottos, reload]
  )

  return <MyOttosContext.Provider value={myOttos}>{children}</MyOttosContext.Provider>
}
