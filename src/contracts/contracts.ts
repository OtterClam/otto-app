import { useEthers } from '@usedapp/core'
import { Contract } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { useMemo } from 'react'
import {
  ERC20Abi,
  IOttoItemFactoryAbi,
  OttoAbi,
  OttoItemAbi,
  OttopiaStoreAbi,
  OttopiaPortalCreatorAbi,
  OttoSummonerAbi,
  OttoItemGiveawayAbi,
  ClamMaiContractAbi,
  StakingContractAbi,
  ClamCirculatingSupplyAbi,
  StakedClamTokenContractAbi,
  OtterStakingPearlHelperAbi,
  OttoHellDiceRollerApi,
  ClamPondAbi,
  PearlBankAbi,
  RewardManagerAbi,
  OtterWrappedUsdPlusAbi,
} from './abis'
import { OttoItem } from './__generated__/OttoItem'
import { OttopiaStore } from './__generated__/OttopiaStore'
import { Otto } from './__generated__/Otto'
import { OttopiaPortalCreator } from './__generated__/OttopiaPortalCreator'
import { IOttoItemFactory } from './__generated__/IOttoItemFactory'
import {
  ClamCirculatingSupply,
  ClamMaiContract,
  ClamPond,
  Erc20,
  OtterRewardManager,
  OtterStakingPearlHelper,
  OtterWrappedUsdPlusToken,
  OttoHellDiceRoller,
  PearlBank,
  StakedClamTokenContract,
  StakingContract,
} from './__generated__'
import { OttoItemGiveaway } from './__generated__/OttoItemGiveaway'

export function useERC20(address: string) {
  const { library } = useEthers()
  return useMemo(() => new Contract(address, ERC20Abi, library?.getSigner()) as Erc20, [address, library])
}

export function useStakedClamContract() {
  const { sCLAM } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(sCLAM, StakedClamTokenContractAbi, library) as StakedClamTokenContract
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

export function useClamMaiContract() {
  const { MAI_CLAM } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(MAI_CLAM, ClamMaiContractAbi, library) as ClamMaiContract
}

export function useStakingContract() {
  const { STAKING } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(STAKING, StakingContractAbi, library) as StakingContract
}

export function useClamCirculatingSupply() {
  const { CLAM_CIRCULATING_SUPPLY } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(CLAM_CIRCULATING_SUPPLY, ClamCirculatingSupplyAbi, library) as ClamCirculatingSupply
}

export function useStakingPearlHelper() {
  const { STAKING_PEARL_HELPER_ADDRESS } = useContractAddresses()
  const { library } = useEthers()
  return new Contract(STAKING_PEARL_HELPER_ADDRESS, OtterStakingPearlHelperAbi, library) as OtterStakingPearlHelper
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
