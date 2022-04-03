import { useContractFunction, useEthers } from '@usedapp/core'
import { Contract } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { ERC20, OttopiaPortalCreator, OttoSummoner } from './abis'

type Token = 'clam' | 'eth'

export const useApprove = (token: Token) => {
  const { WETH, CLAM } = useContractAddresses()
  const { library } = useEthers()
  const erc20 = new Contract(token === 'clam' ? CLAM : WETH, ERC20, library)
  const { state: approveState, send: approve, resetState: resetApprove } = useContractFunction(erc20, 'approve')
  return { approveState, approve, resetApprove }
}

export const useMint = () => {
  const { PORTAL_CREATOR } = useContractAddresses()
  const { library } = useEthers()
  const portal = new Contract(PORTAL_CREATOR, OttopiaPortalCreator, library)
  const { state: mintState, send: mint, resetState: resetMint } = useContractFunction(portal, 'mint')
  return { mintState, mint, resetMint }
}

export const useOpenPortal = () => {
  const { SUMMONER } = useContractAddresses()
  const { library } = useEthers()
  const summoner = new Contract(SUMMONER, OttoSummoner, library)
  const { state: openState, send: open, resetState: resetOpen } = useContractFunction(summoner, 'requestOpen')
  return { openState, open, resetOpen }
}
