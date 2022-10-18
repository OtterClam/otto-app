import Otto from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useMemo } from 'react'

export default function useAdventureOttosWithItem(itemId: string): Otto[] {
  const { ottos } = useMyOttos()
  return useMemo(() => {
    return ottos.filter(otto => otto.wearableTraits.find(trait => trait.id === itemId))
  }, [ottos, itemId])
}
