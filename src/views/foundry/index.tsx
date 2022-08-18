import OttoDialog from 'components/OttoDialog'
import { useApi } from 'contexts/Api'
import { ERC1155ApprovalProvider } from 'contexts/ERC1155Approval'
import useContractAddresses from 'hooks/useContractAddresses'
import useMyItems from 'hooks/useMyItems'
import { Forge } from 'models/Forge'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Headline } from 'styles/typography'
import ForgeList from './ForgeList'
import FoundryHero from './FoundryHero'
import { MyItemAmounts } from './type'

const StyledHeader = styled.div`
  height: 520px;
`

const StyledDialog = styled(OttoDialog)`
  max-width: 378px;
`

const useForges = () => {
  const api = useApi()
  const [forges, setForges] = useState<Forge[]>([])

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
    return items.reduce((counts, item) => {
      counts[item.id] = item.amount ?? 0
      return counts
    }, {} as MyItemAmounts)
  }, [items])

  return { amounts, refetchMyItems }
}

export default function FoundryView() {
  const { OTTO_ITEM, FOUNDRY } = useContractAddresses()
  const forges = useForges()
  const { amounts, refetchMyItems } = useMyItemAmounts()

  return (
    <ERC1155ApprovalProvider contract={OTTO_ITEM} operator={FOUNDRY}>
      <FoundryHero />
      <ForgeList forges={forges} itemAmounts={amounts} refetchMyItems={refetchMyItems} />
    </ERC1155ApprovalProvider>
  )
}
