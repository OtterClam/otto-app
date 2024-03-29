import { useCall, useCalls, useEthers } from '@usedapp/core'
import { BigNumber, BigNumberish, constants } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { useCallback, useEffect, useState } from 'react'
import {
  useAdventureContract,
  useClamPond,
  useERC1155,
  useERC20,
  useItemContract,
  useOcUsdPlus,
  useOttoContract,
  useOttoHellDiceRoller,
  usePearlBank,
  useRewardManager,
  useStoreContract,
} from './contracts'
import useOtterMine from './useOtterMine'

export const useMintInfo = (quantity: number) => {
  const contract = useStoreContract()
  const result = useCalls([
    {
      contract,
      method: 'payment',
      args: ['portal'],
    },
    {
      contract,
      method: 'totalPayment',
      args: ['portal', quantity],
    },
  ])
  return {
    price: (result?.[0]?.value?.[0] || constants.Zero) as BigNumber,
    totalPayment: (result?.[1]?.value?.[0] || constants.Zero) as BigNumber,
  }
}

export const useOttoInfo = () => {
  const contract = useOttoContract()
  const results = useCalls([
    {
      contract,
      method: 'totalSupply',
      args: [],
    },
  ])
  results.forEach((result, idx) => {
    if (result && result.error) {
      console.error(`Error encountered  ${result.error.message}`)
    }
  })
  return results.map(result => Number(result?.value?.[0].toNumber() || 0))
}

export const useItemApplicable = (itemId: string, ottoIds: string[]) => {
  const contract = useItemContract()
  const results = useCalls(
    ottoIds.map(ottoId => ({
      contract,
      method: 'applicable',
      args: [itemId, ottoId],
    }))
  )
  results.forEach((result, idx) => {
    if (result && result.error) {
      console.error(`Error encountered  ${result.error.message}`)
    }
  })
  return results.map(result => Boolean(result?.value?.[0] || false))
}

export const useStoreAirdropAmounts = (productIds: string[], ottoIds: string[]) => {
  const contract = useStoreContract()
  const results = useCalls(
    productIds.map(productId => ({
      contract,
      method: 'airdropClaimableAmount',
      args: [productId, ottoIds],
    }))
  )
  results.forEach((result, idx) => {
    if (result && result.error) {
      console.error(`Error encountered  ${result.error.message}`)
    }
  })
  return results.map(result => Number(result?.value?.[0] || 0))
}

export interface KeyMetrics {
  clamPrice?: BigNumber
  index?: BigNumber
  pearlPrice?: BigNumber
  tvd?: BigNumber
}

export function usePearlBankFee(amount?: BigNumber) {
  const pearlBank = usePearlBank()
  const { account } = useEthers()

  const [baseResult, feeRateResult, durationResult, feeResult] = useCalls([
    {
      contract: pearlBank,
      method: 'BASE',
      args: [],
    },
    {
      contract: pearlBank,
      method: 'withdrawFeeRate',
      args: [],
    },
    {
      contract: pearlBank,
      method: 'withdrawFeeDuration',
      args: [],
    },
    account &&
      amount && {
        contract: pearlBank,
        method: 'withdrawFee',
        args: [account, amount],
      },
  ])

  const base = baseResult?.value ? baseResult?.value[0] : BigNumber.from(1)
  const feeRate = feeRateResult?.value ? feeRateResult?.value[0] : BigNumber.from(0)
  const duration = durationResult?.value ? durationResult?.value[0] : BigNumber.from(0)
  const fee = feeResult?.value ? feeResult?.value[0] : BigNumber.from(0)

  return {
    base,
    feeRate,
    duration,
    fee,
  }
}

export function useClamPondFee(amount?: BigNumber) {
  const clamPond = useClamPond()
  const { account } = useEthers()

  const [feeRateResult, durationResult, feeResult] = useCalls([
    {
      contract: clamPond,
      method: 'withdrawFeeRate',
      args: [],
    },
    {
      contract: clamPond,
      method: 'withdrawFeeDuration',
      args: [],
    },
    account &&
      amount && {
        contract: clamPond,
        method: 'withdrawFee',
        args: [account, amount],
      },
  ])

  const feeRate = feeRateResult?.value ? feeRateResult?.value[0] : BigNumber.from(0)
  const duration = durationResult?.value ? durationResult?.value[0] : BigNumber.from(0)
  const fee = feeResult?.value ? feeResult?.value[0] : BigNumber.from(0)

  return { base: BigNumber.from(10000), fee, feeRate, duration }
}

export function usePearlBankAvailableReward() {
  const pearlBank = usePearlBank()
  const ocUsdPlus = useOcUsdPlus()
  const { OC_USD_PLUS } = useContractAddresses()
  const { account } = useEthers()

  const result = useCall(
    account && {
      contract: pearlBank,
      method: 'getAvailableTokenRewards',
      args: [account, OC_USD_PLUS],
    }
  )
  const availableWrappedUsdPlus = result?.value ? result?.value[0] : constants.Zero
  return useUsdPlusAmount(availableWrappedUsdPlus)
}

export function usePearlBankInfo() {
  const pearlBank = usePearlBank()
  const { OC_USD_PLUS } = useContractAddresses()

  const [latestReward, lastStaked] = useCalls([
    {
      contract: pearlBank,
      method: 'latestTokenRewards',
      args: [OC_USD_PLUS],
    },
    {
      contract: pearlBank,
      method: 'lastTotalMultipliedStaked',
      args: [OC_USD_PLUS],
    },
  ])
  const latestTotalReward = latestReward?.value ? latestReward?.value[0] : constants.Zero
  const convertedTotalReward = useUsdPlusAmount(latestTotalReward)
  return {
    latestTotalReward: convertedTotalReward,
    lastTotalStaked: lastStaked?.value ? lastStaked?.value[0] : constants.Zero,
  }
}

export function useUsdPlusAmount(amount?: BigNumber) {
  const ocUsdPlus = useOcUsdPlus()
  const result = useCall(
    amount?.gt(0) && {
      contract: ocUsdPlus,
      method: 'usdPlusAmount',
      args: [amount],
    }
  )
  return result?.value ? result?.value[0] : constants.Zero
}

export function useClamPondDepositInfo() {
  const clamPond = useClamPond()
  const { account } = useEthers()

  const [info, balance] = useCalls([
    account && {
      contract: clamPond,
      method: 'depositInfo',
      args: [account],
    },
    account && {
      contract: clamPond,
      method: 'balanceOf',
      args: [account],
    },
  ])

  return {
    timestamp: info?.value?.timestamp ?? constants.Zero,
    balance: balance?.value?.[0] ?? constants.Zero,
  }
}

export function useNextRewardTime() {
  const rewardManager = useRewardManager()
  const result = useCall({
    contract: rewardManager,
    method: 'nextPayoutTime',
    args: [],
  })
  return result?.value ? result?.value[0] : constants.Zero
}

export function useAttributePoints(ottoId?: string) {
  const otto = useOttoContract()
  const result = useCall(
    ottoId && {
      contract: otto,
      method: 'infos',
      args: [ottoId],
    }
  )
  return result?.value?.attributePoints ?? 0
}

export function useIsApprovedForAll(contract: string, account: string, operator: string) {
  const erc1155 = useERC1155(contract)
  const [isApprovedForAll, setIsApprovedForAll] = useState(false)

  const updateApprovalStatus = useCallback(() => {
    if (account && operator) {
      erc1155.isApprovedForAll(account, operator).then(setIsApprovedForAll)
    }
  }, [erc1155, operator, account])

  useEffect(() => {
    updateApprovalStatus()
  }, [updateApprovalStatus])

  return {
    isApprovedForAll,
    updateApprovalStatus,
  }
}

export const useBuyFishReturn = (amount: BigNumberish) => {
  const store = useStoreContract()
  const result = useCall({ contract: store, method: 'maticToFish', args: [amount] })
  return result?.value?.[0].toString() || '0'
}

export const useFinishFee = (passId: BigNumberish | undefined) => {
  const adventure = useAdventureContract()
  const result = useCall(passId ? { contract: adventure, method: 'finishFee', args: [passId] } : undefined)
  return result?.value?.[0].toString() || '0'
}

export const useMineInfo = () => {
  const mine = useOtterMine()
  const {
    tokens: { DAI },
  } = useContractAddresses()
  const usd = useCall({ contract: mine, method: 'usd', args: [] })?.value?.[0] || DAI
  const usdToken = useERC20(usd)
  const [usdPerClam, deadline, availableSupply, decimals] = useCalls([
    {
      contract: mine,
      method: 'usdPerClam',
      args: [],
    },
    {
      contract: mine,
      method: 'deadline',
      args: [],
    },
    {
      contract: usdToken,
      method: 'balanceOf',
      args: [mine.address],
    },
    {
      contract: usdToken,
      method: 'decimals',
      args: [],
    },
  ])
  return {
    usdPerClam: usdPerClam?.value?.[0],
    deadline: deadline?.value?.[0],
    availableSupply: availableSupply?.value?.[0],
    decimals: decimals?.value?.[0] || 0,
  }
}

export const useDiceInfo = () => {
  const ottoHellDiceRoller = useOttoHellDiceRoller()
  const store = useStoreContract()
  const key = useCall({
    contract: ottoHellDiceRoller,
    method: 'PAYMENT_KEY',
    args: [],
  })
  const price = useCall(
    key?.value?.[0] && {
      contract: store,
      method: 'payment',
      args: [key.value[0]],
    }
  )
  return { price: price?.value?.[0] }
}

export const useReviveInfo = () => {
  const adventure = useAdventureContract()
  const store = useStoreContract()
  const key = useCall({
    contract: adventure,
    method: 'REVIVE_PAYMENT_KEY',
    args: [],
  })
  const price = useCall(
    key?.value?.[0] && {
      contract: store,
      method: 'payment',
      args: [key.value[0]],
    }
  )
  return { price: price?.value?.[0] }
}
