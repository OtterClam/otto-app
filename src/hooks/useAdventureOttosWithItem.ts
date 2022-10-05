import { useAdventureOttos } from 'contexts/AdventureOttos'
import { AdventureOtto } from 'models/AdventureOtto'
import { useMyOttos } from 'MyOttosProvider'
import { useMemo } from 'react'

export default function useAdventureOttosWithItem(itemId: string): AdventureOtto[] {
  const { ottos: adventureOttos } = useAdventureOttos()
  const { ottos } = useMyOttos()

  const adventureOttosMap = useMemo(() => {
    return adventureOttos.reduce(
      (map, otto) =>
        Object.assign(map, {
          [otto.id]: otto,
        }),
      {} as { [k: string]: AdventureOtto }
    )
  }, [adventureOttos])

  return useMemo(() => {
    return ottos
      .filter(otto => otto.wearableTraits.find(trait => trait.id === itemId) && adventureOttosMap[otto.tokenId])
      .map(otto => adventureOttosMap[otto.tokenId])
  }, [adventureOttos, ottos, itemId])
}
