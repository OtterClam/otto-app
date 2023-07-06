import { useEthers } from '@usedapp/core'
import { Contract, Signer } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { useMemo } from 'react'
import {
  AdventureAbi,
  ClamCirculatingSupplyAbi,
  ClamPondAbi,
  ERC1155Abi,
  ERC20Abi,
  FoundryAbi,
  IOttoItemFactoryAbi,
  OtterWrappedUsdPlusAbi,
  OttoAbi,
  OttoHellDiceRollerApi,
  OttoItemAbi,
  OttoItemGiveawayAbi,
  OttopiaPortalCreatorAbi,
  OttopiaStoreAbi,
  OttoSummonerAbi,
  PearlBankAbi,
  RewardManagerAbi,
  MissionAbi,
} from './abis'
import {
  ClamCirculatingSupply,
  ClamPond,
  Erc20,
  Mission,
  OtterRewardManager,
  OtterWrappedUsdPlusToken,
  OttoHellDiceRoller,
  PearlBank,
} from './__generated__'
import { Adventure } from './__generated__/Adventure'
import { ERC1155 } from './__generated__/ERC1155'
import { Foundry } from './__generated__/Foundry'
import { IOttoItemFactory } from './__generated__/IOttoItemFactory'
import { Otto } from './__generated__/Otto'
import { OttoItem } from './__generated__/OttoItem'
import { OttoItemGiveaway } from './__generated__/OttoItemGiveaway'
import { OttopiaPortalCreator } from './__generated__/OttopiaPortalCreator'
import { OttopiaStore } from './__generated__/OttopiaStore'

export function useERC20(address: string) {
  const { library } = useEthers()
  return useMemo(
    () => getERC20(address, library && 'getSigner' in library ? library.getSigner() : undefined),
    [address, library]
  )
}

export function getERC20(address: string, signer?: Signer) {
  return new Contract(address, ERC20Abi, signer) as Erc20
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
  const { account, library } = useEthers()
  return useMemo(
    () => new Contract(OTTO_ITEM, OttoItemAbi, library && 'getSigner' in library ? library.getSigner() : undefined),
    [OTTO_ITEM, library]
  )
}

export function useStoreContract() {
  const { OTTOPIA_STORE } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(OTTOPIA_STORE, OttopiaStoreAbi, library) as OttopiaStore
}

export function useOttoHellDiceRoller() {
  const { OTTO_HELL_DICE_ROLLER } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(OTTO_HELL_DICE_ROLLER, OttoHellDiceRollerApi, library) as OttoHellDiceRoller
}

export function useItemFactoryContract(address: string) {
  const { library } = useEthers()
  return new Contract(address, IOttoItemFactoryAbi, library) as IOttoItemFactory
}

export function useItemGiveaway() {
  const { OTTO_ITEM_GIVEAWAY } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(OTTO_ITEM_GIVEAWAY, OttoItemGiveawayAbi, library) as OttoItemGiveaway
}

export function useClamCirculatingSupply() {
  const { CLAM_CIRCULATING_SUPPLY } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(CLAM_CIRCULATING_SUPPLY, ClamCirculatingSupplyAbi, library) as ClamCirculatingSupply
}

export function useClamPond() {
  const { CLAM_POND } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(CLAM_POND, ClamPondAbi, library) as ClamPond
}

export function usePearlBank() {
  const { PEARL_BANK } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(PEARL_BANK, PearlBankAbi, library) as PearlBank
}

export function useRewardManager() {
  const { REWARD_MANAGER } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(REWARD_MANAGER, RewardManagerAbi, library) as OtterRewardManager
}

export function useOcUsdPlus() {
  const { OC_USD_PLUS } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(OC_USD_PLUS, OtterWrappedUsdPlusAbi, library) as OtterWrappedUsdPlusToken
}

export function useFoundry() {
  const { FOUNDRY } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(FOUNDRY, FoundryAbi, library) as Foundry
}

export function useERC1155(address: string) {
  const { library } = useEthers()
  return new Contract(address, ERC1155Abi, library) as ERC1155
}

export function useAdventureContract() {
  const { ADVENTURE } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(ADVENTURE, AdventureAbi, library) as Adventure
}

export function useMissionContract() {
  const { MISSION } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(MISSION, MissionAbi, library) as Mission
}
