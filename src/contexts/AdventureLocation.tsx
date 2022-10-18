import { AdventureLocation } from 'models/AdventureLocation'
import { createContext, PropsWithChildren, useContext } from 'react'

const AdventureLocationContext = createContext<AdventureLocation | undefined>(undefined)

export const AdventureLocationProvider = ({
  location,
  children,
}: PropsWithChildren<{ location?: AdventureLocation }>) => {
  return <AdventureLocationContext.Provider value={location}>{children}</AdventureLocationContext.Provider>
}

export const useAdventureLocation = () => {
  return useContext(AdventureLocationContext)
}
