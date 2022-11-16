import { AdventurePreview } from 'models/AdventurePreview'
import { ItemAction } from 'models/Item'
import Otto from 'models/Otto'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

const AdventureOttoContext = createContext<{
  otto?: Otto
  draftOtto?: Otto
  actions: ItemAction[]
}>({ actions: [] })

export const AdventureOttoProvider = ({
  otto,
  draftOtto,
  children,
  actions = [],
}: PropsWithChildren<{ otto?: Otto; draftOtto?: Otto; actions?: ItemAction[] }>) => {
  const value = useMemo(
    () => ({
      otto,
      draftOtto,
      actions,
    }),
    [otto, draftOtto, actions]
  )

  return <AdventureOttoContext.Provider value={value}>{children}</AdventureOttoContext.Provider>
}

export const useAdventureOtto = () => {
  return useContext(AdventureOttoContext)
}
