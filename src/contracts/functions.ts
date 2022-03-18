import { useContractFunction, useEthers } from '@usedapp/core'
import { Contract } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { abi as erc20Abi } from './erc20.json'
import { abi as OttopiaPortalCreator } from './OttopiaPortalCreator.json'

type Token = 'clam' | 'eth'

export const useApprove = (token: Token) => {
  const { WETH, CLAM } = useContractAddresses()
  const { library } = useEthers()
  const erc20 = new Contract(token === 'clam' ? CLAM : WETH, erc20Abi, library)
  const { state: approveState, send: approve } = useContractFunction(erc20, 'approve')
  return { approveState, approve }
}

export const useMint = () => {
  const { PORTAL_CREATOR } = useContractAddresses()
  const { library } = useEthers()
  const portal = new Contract(PORTAL_CREATOR, OttopiaPortalCreator, library)
  const { state: mintState, send: mint } = useContractFunction(portal, 'mint')
  return { mintState, mint }
}
