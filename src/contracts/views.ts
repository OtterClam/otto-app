import { useCall, useCalls, useEthers } from '@usedapp/core'
import { BigNumber, constants } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { useCallback, useEffect, useState } from 'react'
import {
  useClamPond,
  useERC1155,
  useItemContract,
  useOcUsdPlus,
  useOttoContract,
  usePearlBank,
  usePortalCreatorContract,
  useRewardManager,
  useStoreContract,
} from './contracts'

export const useMintInfo = (quantity: number) => {
  const contract = usePortalCreatorContract()
  const result = useCall({
    contract,
    method: 'currentPrice',
    args: [quantity],
  })
  return (result?.value?.[0] || constants.Zero).div(quantity)
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
    balance: balance?.value[0] ?? constants.Zero,
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
