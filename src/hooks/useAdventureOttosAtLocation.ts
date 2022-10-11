import Otto from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useMemo } from 'react'

export default function useAdventureOttosAtLocation(locationId?: number): Otto[] {
  const { ottos } = useMyOttos()
  return useMemo(() => {
    return ottos.filter(otto => otto.latestAdventurePass?.locationId === locationId)
  }, [ottos, locationId])
}
