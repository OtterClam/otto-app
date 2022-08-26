import noop from 'lodash/noop'
import Otto from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

const OttoContext = createContext<{ otto?: Otto; setOtto: (otto?: Otto) => void; loading: boolean }>({
  setOtto: noop,
  loading: true,
})

export function withOtto<P>(Component: FC<P>): FC<P> {
  return props => (
    <OttoProvider>
      <Component {...props} />
    </OttoProvider>
  )
}

export function OttoProvider({ children }: PropsWithChildren<object>) {
  const { ottos, loading, reload } = useMyOttos()
  const [initialized, setInitialized] = useState(false)
  const [otto, setOtto] = useState<Otto | undefined>()

  useEffect(() => {
    reload()
  }, [])

  useEffect(() => {
    if (!loading) {
      setInitialized(true)
    }
  }, [loading])

  useEffect(() => {
    if (!otto && ottos.length > 0) {
      setOtto(ottos[0])
    }
  }, [ottos])

  const value = useMemo(
    () => ({
      otto,
      setOtto,
      loading: !initialized || loading,
    }),
    [loading, initialized, otto]
  )

  return <OttoContext.Provider value={value}>{children}</OttoContext.Provider>
}

export const useOtto = () => useContext(OttoContext)
