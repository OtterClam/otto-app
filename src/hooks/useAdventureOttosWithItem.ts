import { useAdventureOttos } from 'contexts/AdventureOttos'
import Otto from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useMemo } from 'react'

export default function useAdventureOttosWithItem(itemId: string): Otto[] {
  const { ottos: adventureOttos } = useAdventureOttos()
  const { ottos } = useMyOttos()

  const adventureOttosMap = useMemo(() => {
    return adventureOttos.reduce(
      (map, otto) =>
        Object.assign(map, {
          [otto.id]: otto,
        }),
      {} as { [k: string]: Otto }
    )
  }, [adventureOttos])

  return useMemo(() => {
    return ottos
      .filter(otto => otto.wearableTraits.find(trait => trait.id === itemId) && adventureOttosMap[otto.id])
      .map(otto => adventureOttosMap[otto.id])
  }, [adventureOttos, ottos, itemId])
}
