import { AdventurePreview } from 'models/AdventurePreview'
import Otto from 'models/Otto'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

const AdventureOttoContext = createContext<{
  otto?: Otto
  draftOtto?: Otto
}>({})

export const AdventureOttoProvider = ({
  otto,
  preview,
  children,
}: PropsWithChildren<{ otto?: Otto; preview?: AdventurePreview }>) => {
  const draftOtto = useMemo(() => {
    if (!(otto && preview)) {
      return
    }
    return new Otto({ ...otto.raw, ...preview })
  }, [otto, preview])

  const value = useMemo(
    () => ({
      otto,
      draftOtto,
    }),
    [otto, preview]
  )

  return <AdventureOttoContext.Provider value={value}>{children}</AdventureOttoContext.Provider>
}

export const useAdventureOtto = () => {
  return useContext(AdventureOttoContext)
}
