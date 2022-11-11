import { ItemActionType } from 'constant'
import noop from 'lodash/noop'
import { ItemAction, Item } from 'models/Item'
import Otto, { AdventureOttoStatus, OttoGender } from 'models/Otto'
import { useMyOttos } from 'MyOttosProvider'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { useMyItems } from './MyItems'

const OttoContext = createContext<{
  otto?: Otto
  setOtto: (otto?: Otto) => void
  resetEquippedItems: () => void
  unequipAllItems: () => void
  equipItem: (traitType: string, traitId: string) => void
  removeItem: (traitType: string) => void
  itemActions: ItemAction[]
}>({
  setOtto: noop,
  unequipAllItems: noop,
  resetEquippedItems: noop,
  equipItem: noop,
  removeItem: noop,
  itemActions: [],
})

export function withOtto<P>(Component: FC<P>): FC<P> {
  return props => (
    <OttoProvider>
      <Component {...props} />
    </OttoProvider>
  )
}

export function OttoProvider({ children }: PropsWithChildren<object>) {
  const { ottos } = useMyOttos()
  const { items } = useMyItems()
  const [otto, setOtto] = useState<Otto | undefined>()
  const [draftItems, setDraftItems] = useState<Record<string, string | null>>({})
  const actions = useMemo(() => {
    const uniqueItems = items.reduce((map, item) => {
      // pick non-equipped items first if there multiple items
      if (map[item.metadata.tokenId] && !map[item.metadata.tokenId].equippedBy) {
        return map
      }
      return Object.assign(map, { [item.metadata.tokenId]: item })
    }, {} as Record<string, Item>)
    const ottoIdToOtto = ottos.reduce(
      (map, otto) => Object.assign(map, { [otto.id]: otto }),
      {} as { [k: string]: Otto }
    )
    const equippedItemToOtto = ottos
      .filter(otto => otto.adventureStatus === AdventureOttoStatus.Ready)
      .map(({ id }) => ottoIdToOtto[id])
      .filter(Boolean)
      .map(otto =>
        otto.wearableTraits.reduce((map, trait) => Object.assign(map, { [trait.id]: otto }), {} as Record<string, Otto>)
      )
      .reduce((all, map) => Object.assign(all, map), {} as { [k: string]: Otto })

    const ottoItems = (otto?.wearableTraits ?? []).reduce(
      (map, trait) => Object.assign(map, { [trait.type]: trait.id }),
      {} as { [k: string]: string }
    )

    const cleanedDraftItems = Object.keys(draftItems).reduce(
      (items, type) => {
        if (items[type] !== null && ottoItems[type] === items[type]) {
          delete items[type]
        } else if (items[type] === null && !ottoItems[type]) {
          delete items[type]
        }
        return items
      },
      { ...draftItems }
    )

    return !otto
      ? []
      : Object.keys(cleanedDraftItems).map(type => {
          const itemId = cleanedDraftItems[type]

          if (itemId === null) {
            return {
              type: ItemActionType.TakeOff,
              item_id: Number(ottoItems[type]),
              from_otto_id: 0,
            }
          }

          if (uniqueItems[itemId].equippedBy) {
            return {
              type: ItemActionType.EquipFromOtto,
              item_id: Number(itemId),
              from_otto_id: Number(equippedItemToOtto[itemId].id),
            }
          }

          return {
            type: ItemActionType.Equip,
            item_id: Number(itemId),
            from_otto_id: 0,
          }
        })
  }, [draftItems, items.map(({ metadata }) => metadata.tokenId).join(',')])

  const value = useMemo(() => {
    return {
      otto,
      setOtto,
      equipItem: (traitType: string, traitId: string) => {
        setDraftItems(map => {
          const equippedItemIndex = otto?.equippedItems.findIndex(item => item.metadata.tokenId === traitId) ?? -1
          const nativeItemIndex = otto?.nativeItemsMetadata.findIndex(metadata => metadata.tokenId === traitId) ?? -1

          if (equippedItemIndex !== -1 || nativeItemIndex !== -1) {
            const newMap = { ...map }
            delete newMap[traitType]
            return newMap
          }

          return {
            ...map,
            [traitType]: traitId,
          }
        })
      },
      removeItem: (traitType: string) => {
        setDraftItems(map => {
          const newMap = { ...map }
          if (newMap[traitType]) {
            delete newMap[traitType]
          } else {
            newMap[traitType] = null
          }
          return newMap
        })
      },
      resetEquippedItems: () => {
        setDraftItems({})
      },
      unequipAllItems: () => {
        const draftItems: Record<string, string | null> = {}
        otto?.wearableTraits.forEach(({ type, unreturnable }) => {
          if (!unreturnable) {
            draftItems[type] = null
          }
        })
        setDraftItems(draftItems)
      },
      itemActions: actions,
    }
  }, [otto, actions])

  return <OttoContext.Provider value={value}>{children}</OttoContext.Provider>
}

export const useOtto = () => useContext(OttoContext)
