import { AdventurePreview } from 'models/AdventurePreview'
import Otto from 'models/Otto'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

const AdventureOttoContext = createContext<{
  otto?: Otto
  draftOtto?: Otto
}>({})

export const AdventureOttoProvider = ({
  otto,
  draftOtto,
  children,
}: PropsWithChildren<{ otto?: Otto; draftOtto?: Otto }>) => {
  const value = useMemo(
    () => ({
      otto,
      draftOtto,
    }),
    [otto, draftOtto]
  )

  return <AdventureOttoContext.Provider value={value}>{children}</AdventureOttoContext.Provider>
}

export const useAdventureOtto = () => {
  return useContext(AdventureOttoContext)
}
