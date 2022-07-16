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

export const useTreasuryRealtimeMetrics = () => {
  const { MAI, CLAM } = useContractAddresses()
  const clamMaiContract = useClamMaiContract()
  const stakingContract = useStakingContract()
  const clamCirculatingSupply = useClamCirculatingSupply()
  const sClamContract = useStakedClamContract()
  const clamContract = useERC20(CLAM)

  const results = useCalls([
    {
      contract: sClamContract,
      method: 'circulatingSupply',
      args: [],
    },
    {
      contract: clamContract,
      method: 'totalSupply',
      args: [],
    },
    {
      contract: clamCirculatingSupply,
      method: 'CLAMCirculatingSupply',
      args: [],
    },
    {
      contract: stakingContract,
      method: 'index',
      args: [],
    },
    {
      contract: clamMaiContract,
      method: 'getReserves',
      args: [],
    },
    {
      contract: stakingContract,
      method: 'epoch',
      args: [],
    },
  ])

  results.forEach(result => {
    if (result?.error) {
      console.error('failed to get value from contract:', result.error)
    }
  })

  const sClamCirculatingSupply = results[0]?.value[0] ?? BigNumber.from(0)
  const [clamReserve, maiReserve] = (
    BigNumber.from(MAI).gt(CLAM)
      ? [results[4]?.value[0], results[4]?.value[1]]
      : [results[4]?.value[1], results[4]?.value[0]]
  ) as [BigNumber, BigNumber]
  const clamPrice = clamReserve && maiReserve ? maiReserve.div(clamReserve) : BigNumber.from(0)
  const index = results[3]?.value[0] ?? BigNumber.from(0)
  const pearlPrice = clamPrice.mul(index)
  const tvd = sClamCirculatingSupply.mul(clamPrice)
  const nextRewardRate = ((results[5]?.value?.distribute || 0) * 1e9) / sClamCirculatingSupply / 1e9
  const apy = ((1 + nextRewardRate) ** 1095 - 1) * 100

  return {
    clamPrice,
    pearlPrice,
    index,
    tvd,
    nextRewardRate,
    apy,
  }
}

export const useStakedBalance = (account?: string) => {
  const { sCLAM, PEARL } = useContractAddresses()
  const sClamContract = useERC20(sCLAM)
  const pearlContract = useERC20(PEARL)

  const results = useCalls([
    account && {
      contract: sClamContract,
      method: 'balanceOf',
      args: [account],
    },
    account && {
      contract: pearlContract,
      method: 'balanceOf',
      args: [account],
    },
  ])

  results.forEach(result => {
    if (result?.error) {
      console.error('failed to get value from contract:', result.error)
    }
  })

  const sClamBalance = results[0]?.value[0] ?? BigNumber.from(0)
  const pearlBalance = results[1]?.value[0] ?? BigNumber.from(0)

  return {
    sClamBalance,
    pearlBalance,
  }
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

export function useTotalPearlBankStakedAmount(): BigNumber {
  const pearlBank = usePearlBank()
  const result = useCall({
    contract: pearlBank,
    method: 'totalStaked',
    args: [],
  })

  return result?.value ? result?.value[0] : BigNumber.from(0)
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

export function useTotalDepositedAmount() {
  const clamPond = useClamPond()

  const [result] = useCalls([
    {
      contract: clamPond,
      method: 'totalSupply',
      args: [],
    },
  ])

  return result?.value ? result?.value[0] : BigNumber.from(0)
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
