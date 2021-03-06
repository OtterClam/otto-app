import { useCall, useCalls, useEthers } from '@usedapp/core'
import { BigNumber, constants } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import {
  useClamCirculatingSupply,
  useClamMaiContract,
  useClamPond,
  useERC20,
  useItemContract,
  useOcUsdPlus,
  useOttoContract,
  usePearlBank,
  usePortalCreatorContract,
  useRewardManager,
  useStakedClamContract,
  useStakingContract,
  useStoreContract,
} from './contracts'

export const useMintInfo = () => {
  const contract = usePortalCreatorContract()
  const results =
    useCalls([
      {
        contract,
        method: 'priceInCLAM',
        args: [],
      },
    ]) || {}
  results.forEach((result, idx) => {
    if (result && result.error) {
      console.error(`Error encountered  ${result.error.message}`)
    }
  })
  return results.map(result => BigNumber.from(result?.value?.[0] || '0'))
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

export const useClamPrice = (): BigNumber | undefined => {
  const { MAI, CLAM } = useContractAddresses()
  const clamMaiContract = useClamMaiContract()
  const [result] = useCalls([
    {
      contract: clamMaiContract,
      method: 'getReserves',
      args: [],
    },
  ])

  if (!result) {
    console.error('failed to get pair reserves')
    return
  }

  if (result.error) {
    console.error('failed to get pair reserves:', result.error)
    return
  }

  const [clamReserve, maiReserve] = (
    BigNumber.from(MAI).gt(CLAM) ? [result.value[0], result.value[1]] : [result.value[1], result.value[0]]
  ) as [BigNumber, BigNumber]

  return maiReserve.div(clamReserve)
}

export const useClamIndex = (): BigNumber | undefined => {
  const stakingContract = useStakingContract()
  const [result] = useCalls([
    {
      contract: stakingContract,
      method: 'index',
      args: [],
    },
  ])

  if (!result) {
    console.error('failed to get pair reserves')
    return
  }

  if (result.error) {
    console.error('failed to get pair reserves:', result.error)
    return
  }

  return result.value
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

export function useDepositedAmount() {
  const clamPond = useClamPond()
  const { account } = useEthers()

  const [balanceResult] = useCalls([
    {
      contract: clamPond,
      method: 'balanceOf',
      args: [account],
    },
  ])

  return balanceResult?.value ? balanceResult?.value[0] : BigNumber.from(0)
}

export function useNextRewardTime() {
  const rewardManager = useRewardManager()
  const result = useCall({
    contract: rewardManager,
    method: 'nextPayoutTime',
    args: [],
  })
  return result?.value ? result?.value[0] : BigNumber.from(0)
}
