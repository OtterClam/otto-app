import { Item } from 'models/Item'
import Otto from 'models/Otto'
import { useMemo } from 'react'

export default function useAdventurePreviewItems(items: Item[], draftOtto?: Otto): Item[] {
  return useMemo(() => {
    if (!draftOtto) {
      return items
    }

    const draftItems = draftOtto.equippedItems.reduce((map, item) => {
      map[item.id] = item
      return map
    }, {} as Record<string, Item>)

    const newItems = items.map(item => {
      const newItem = { ...item }

      if (Object.prototype.hasOwnProperty.call(draftItems, item.id)) {
        newItem.equippedBy = draftOtto.id
      } else if (newItem.equippedBy === draftOtto.id) {
        // handle removed items
        delete newItem.equippedBy
      }

      return newItem
    })

    // handle equipped items
    const newlyEquippedItems = draftOtto.equippedItems.filter(item => item.id.startsWith('draft_'))

    return newItems.concat(newlyEquippedItems)
  }, [items, draftOtto])
}
