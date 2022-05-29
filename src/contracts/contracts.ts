import { useEthers } from '@usedapp/core'
import { Contract } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import {
  ERC20Abi,
  IOttoItemFactoryAbi,
  OttoAbi,
  OttoItemAbi,
  OttopiaStoreAbi,
  OttopiaPortalCreatorAbi,
  OttoSummonerAbi,
} from './abis'
import { OttoItem } from './__generated__/OttoItem'
import { OttopiaStore } from './__generated__/OttopiaStore'
import { Otto } from './__generated__/Otto'
import { OttopiaPortalCreator } from './__generated__/OttopiaPortalCreator'
import { IOttoItemFactory } from './__generated__/IOttoItemFactory'
import { Erc20 } from './__generated__'

export function useERC20(address: string) {
  const { library } = useEthers()
  return new Contract(address, ERC20Abi, library) as Erc20
}

export function useOttoContract() {
  const { OTTO } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(OTTO, OttoAbi, library) as Otto
}

export function usePortalCreatorContract() {
  const { PORTAL_CREATOR } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(PORTAL_CREATOR, OttopiaPortalCreatorAbi, library) as OttopiaPortalCreator
}

export function useOttoSummonerContract() {
  const { SUMMONER } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(SUMMONER, OttoSummonerAbi, library)
}

export function useItemContract() {
  const { OTTO_ITEM } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(OTTO_ITEM, OttoItemAbi, library) as OttoItem
}

export function useStoreContract() {
  const { OTTOPIA_STORE } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(OTTOPIA_STORE, OttopiaStoreAbi, library) as OttopiaStore
}

export function useItemFactoryContract(address: string) {
  const { library } = useEthers()
  return new Contract(address, IOttoItemFactoryAbi, library) as IOttoItemFactory
}
