import { NewItem } from 'models/Item'
import Otto, { AdventureOttoStatus } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { useCallback, useMemo } from 'react'

export default function useIsWearable(items: NewItem[]): (itemId?: string, currentOttoId?: string) => boolean {
  const { ottos } = useMyOttos()
  const readyOttosMap = useMemo(() => {
    return ottos
      .filter(otto => otto.adventureStatus === AdventureOttoStatus.Ready)
      .reduce(
        (map, otto) =>
          Object.assign(map, {
            [otto.id]: otto,
          }),
        {} as { [k: string]: Otto }
      )
  }, [ottos])

  return useCallback(
    (itemId?: string): boolean => {
      if (!itemId) {
        return true
      }

      const itemAmount =
        items.filter(item => !item.equippedBy).find(item => item.metadata.tokenId === itemId)?.amount ?? 0

      const myReadyOttosWithItem = ottos
        .filter(otto => readyOttosMap[otto.id])
        .filter(otto => otto.wearableTraits.find(trait => trait.id === itemId))
        .filter(Boolean)

      return itemAmount > 0 || myReadyOttosWithItem.length > 0
    },
    [readyOttosMap]
  )
}
