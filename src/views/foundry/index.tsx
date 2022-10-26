import { useApi } from 'contexts/Api'
import { ERC1155ApprovalProvider } from 'contexts/ERC1155Approval'
import { useMyItems } from 'contexts/MyItems'
import useAssetsBundles from 'hooks/useAssetsBundles'
import useContractAddresses from 'hooks/useContractAddresses'
import { ForgeFormula } from 'models/Forge'
import { useEffect, useMemo, useState } from 'react'
import { BundleName } from 'worker/consts'
import ForgeList from './ForgeList'
import FoundryHero from './FoundryHero'
import { MyItemAmounts } from './type'

const useForgeFormulas = () => {
  const api = useApi()
  const [forges, setForges] = useState<ForgeFormula[]>([])

  useEffect(() => {
    api
      .getFoundryForges()
      .then(setForges)
      .catch(err => {
        console.warn(err)
      })
  }, [api])

  return forges
}

const useMyItemAmounts = () => {
  const { items, refetch: refetchMyItems } = useMyItems()

  const amounts = useMemo(() => {
    return items
      .filter(item => !item.equippedBy)
      .reduce((counts, item) => {
        counts[item.metadata.tokenId] = item.amount ?? 0
        return counts
      }, {} as MyItemAmounts)
  }, [items])

  return { amounts, refetchMyItems }
}

export default function FoundryView() {
  const { OTTO_ITEM, FOUNDRY } = useContractAddresses()
  const forgeFormulas = useForgeFormulas()
  const { amounts, refetchMyItems } = useMyItemAmounts()

  useAssetsBundles([BundleName.FoundryPage])

  return (
    <ERC1155ApprovalProvider contract={OTTO_ITEM} operator={FOUNDRY}>
      <FoundryHero />
      <ForgeList formulas={forgeFormulas} itemAmounts={amounts} refetchMyItems={refetchMyItems} />
    </ERC1155ApprovalProvider>
  )
}
