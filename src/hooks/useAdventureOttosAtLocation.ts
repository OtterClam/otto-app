import { useAdventureOttos } from 'contexts/AdventureOttos'
import Otto from 'models/Otto'
import { useMemo } from 'react'

export default function useAdventureOttosAtLocation(locationId?: number): Otto[] {
  const { ottos } = useAdventureOttos()
  return useMemo(() => {
    return ottos.filter(otto => otto.latestAdventurePass?.locationId === locationId)
  }, [ottos, locationId])
}
