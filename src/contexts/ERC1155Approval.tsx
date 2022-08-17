import { useEthers } from '@usedapp/core'
import { useERC1155 } from 'contracts/contracts'
import { useIsApprovedForAll } from 'contracts/views'
import { ERC1155Upgradeable } from 'contracts/__generated__/ERC1155Upgradeable'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'

const ERC1155ApprovalContext = createContext<{
  erc1155: ERC1155Upgradeable
  isApprovedForAll: boolean
  updateApprovalStatus: () => void
  operator: string
} | null>(null)

export const ERC1155ApprovalProvider = ({
  contract,
  operator,
  children,
}: PropsWithChildren<{ contract: string; operator: string }>) => {
  const erc1155 = useERC1155(contract)
  const { account } = useEthers()
  const { isApprovedForAll, updateApprovalStatus } = useIsApprovedForAll(contract, account ?? '', operator)

  const value = useMemo(
    () => ({
      erc1155,
      isApprovedForAll,
      updateApprovalStatus,
      operator,
    }),
    [erc1155, isApprovedForAll, updateApprovalStatus, operator]
  )

  return <ERC1155ApprovalContext.Provider value={value}>{children}</ERC1155ApprovalContext.Provider>
}

export const useERC1155Approval = () => useContext(ERC1155ApprovalContext)
