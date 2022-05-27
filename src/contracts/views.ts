import { useCall, useCalls, useEthers } from '@usedapp/core'
import { BigNumber, Contract } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { Otto, OttoItemAbi, OttopiaPortalCreator, OttopiaStoreAbi } from './abis'

export const useMintInfo = () => {
  const { PORTAL_CREATOR } = useContractAddresses()
  const { library } = useEthers()
  const contract = new Contract(PORTAL_CREATOR, OttopiaPortalCreator, library)
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

export const useOttolisted = () => {
  const { PORTAL_CREATOR } = useContractAddresses()
  const { account, library } = useEthers()
  const contract = new Contract(PORTAL_CREATOR, OttopiaPortalCreator, library)
  const { value, error } =
    useCall(
      account && {
        contract,
        method: 'ottolisted',
        args: [account],
      }
    ) || {}
  if (error) {
    console.error(error)
    return 0
  }
  return value ? value[0].toNumber() : null
}

export const useOttoInfo = () => {
  const { OTTO } = useContractAddresses()
  const { library } = useEthers()
  const contract = new Contract(OTTO, Otto, library)
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
  const { OTTO_ITEM } = useContractAddresses()
  const { library } = useEthers()
  const contract = new Contract(OTTO_ITEM, OttoItemAbi, library)
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
  const { OTTOPIA_STORE } = useContractAddresses()
  const { library } = useEthers()
  const contract = new Contract(OTTOPIA_STORE, OttopiaStoreAbi, library)
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

export const useCouponProduct = (couponId: string) => {
  const { OTTOPIA_STORE } = useContractAddresses()
  const { library } = useEthers()
  const contract = new Contract(OTTOPIA_STORE, OttopiaStoreAbi, library)
  const result = useCall(
    couponId && {
      contract,
      method: 'coupons',
      args: [couponId],
    }
  )
  const productId = result?.value[0]
  const productResults = useCalls([
    productId && {
      contract,
      method: 'factories',
      args: [productId],
    },
    productId && {
      contract,
      method: 'products',
      args: [productId],
    },
  ])
  return {
    factory: productResults[0]?.value[0],
    type: productResults[1]?.value.typ,
  }
}
