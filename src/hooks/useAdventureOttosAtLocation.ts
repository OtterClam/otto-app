import { useAdventureOttos } from 'contexts/AdventureOttos'
import { AdventureOtto } from 'models/AdventureOtto'
import { useMemo } from 'react'

export default function useAdventureOttosAtLocation(locationId?: number): AdventureOtto[] {
  const { ottos } = useAdventureOttos()

  return useMemo(() => {
    return ottos.filter(otto => otto.locationId === locationId)
  }, [ottos, locationId])
}
