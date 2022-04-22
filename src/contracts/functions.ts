import { useContractFunction, useEthers } from '@usedapp/core'
import { Contract } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { ERC20, Otto, OttoItem, OttopiaPortalCreator, OttoSummoner } from './abis'

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

export const useSummonOtto = () => {
  const { SUMMONER } = useContractAddresses()
  const { library } = useEthers()
  const summoner = new Contract(SUMMONER, OttoSummoner, library)
  const { state: summonState, send, resetState: resetSummon } = useContractFunction(summoner, 'summon')
  const summon = (tokenId: string, index: number) => send(tokenId, index)
  return { summonState, summon, resetSummon }
}

export const useItem = () => {
  const { OTTO, OTTO_ITEM } = useContractAddresses()
  const { account, library } = useEthers()
  const item = new Contract(OTTO_ITEM, OttoItem, library)
  const { state: useItemState, send, resetState: resetUse } = useContractFunction(item, 'transferToParent')
  const use = (itemId: string, ottoId: string) => send(account, OTTO, ottoId, itemId, [])
  return { useItemState, use, resetUse }
}

export const takeOffItem = () => {
  const { OTTO, OTTO_ITEM } = useContractAddresses()
  const { account, library } = useEthers()
  const otto = new Contract(OTTO, Otto, library)
  const { state: takeOffState, send, resetState: resetTakeOff } = useContractFunction(otto, 'transferChild')
  const takeOff = (itemId: string, ottoId: string) => send(ottoId, account, OTTO_ITEM, itemId, [])
  return { takeOffState, takeOff, resetTakeOff }
}
