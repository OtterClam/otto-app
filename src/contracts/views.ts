import { useBlockNumber, useCall, useCalls, useEtherBalance, useEthers } from '@usedapp/core'
import { Contract, BigNumber } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { Otto, OttoItemAbi, OttopiaPortalCreator } from './abis'

export const useMintInfo = () => {
  const { PORTAL_CREATOR } = useContractAddresses()
  const { library } = useEthers()
  const contract = new Contract(PORTAL_CREATOR, OttopiaPortalCreator, library)
  const results =
    useCalls([
      {
        contract,
        method: 'priceInWETH',
        args: [],
      },
      {
        contract,
        method: 'priceInCLAM',
        args: [],
      },
      {
        contract,
        method: 'clamPerWETH',
        args: [],
      },
      { contract, method: 'saleStage', args: [] },
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
  const { library, account } = useEthers()
  const contract = new Contract(OTTO, Otto, library)
  const results = useCalls([
    {
      contract,
      method: 'totalSupply',
      args: [],
    },
    {
      contract,
      method: 'balanceOf',
      args: [account],
    },
  ])
  results.forEach((result, idx) => {
    if (result && result.error) {
      console.error(`Error encountered  ${result.error.message}`)
    }
  })
  return results.map(result => BigNumber.from(result?.value?.[0] || '0'))
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
