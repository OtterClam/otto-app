import { TransactionState, TransactionStatus, useContractFunction, useEthers } from '@usedapp/core'
import { constants, Contract, ethers, utils } from 'ethers'
import useApi from 'hooks/useApi'
import useContractAddresses from 'hooks/useContractAddresses'
import Item from 'models/Item'
import Product from 'models/store/Product'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ERC20Abi, IOttoItemFactoryAbi, OttoItemAbi } from './abis'
import {
  useERC20,
  useItemContract,
  useItemGiveaway,
  useOttoContract,
  useOttoSummonerContract,
  usePortalCreatorContract,
  useStakingPearlHelper,
  useStoreContract,
} from './contracts'

export const useApprove = (tokenAddress?: string) => {
  const { CLAM } = useContractAddresses()
  const erc20 = useERC20(tokenAddress ?? CLAM)
  const { state: approveState, send: approve, resetState: resetApprove } = useContractFunction(erc20, 'approve')
  return { approveState, approve, resetApprove }
}

export const useMint = () => {
  const portal = usePortalCreatorContract()
  const { state: mintState, send: mint, resetState: resetMint } = useContractFunction(portal, 'mint')
  return { mintState, mint, resetMint }
}

export const useOpenPortal = () => {
  const summoner = useOttoSummonerContract()
  const { state: openState, send: open, resetState: resetOpen } = useContractFunction(summoner, 'requestOpen')
  return { openState, open, resetOpen }
}

export const useSummonOtto = () => {
  const summoner = useOttoSummonerContract()
  const { state: summonState, send, resetState: resetSummon } = useContractFunction(summoner, 'summon')
  const summon = (tokenId: string, index: number) => send(tokenId, index)
  return { summonState, summon, resetSummon }
}

interface OttoTransactionState {
  state: TransactionState
  status: TransactionStatus
  receivedItem?: Item
}

export const useItem = () => {
  const { OTTO } = useContractAddresses()
  const { account } = useEthers()
  const { i18n } = useTranslation()
  const api = useApi()
  const item = useItemContract()
  const { state, send, resetState } = useContractFunction(item, 'transferToParent')
  const [useItemState, setUseItemState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })
  const use = (itemId: string, ottoId: string) => send(account || '', OTTO, ottoId, itemId, [])
  const resetUse = () => {
    resetState()
    setUseItemState({ state: 'None', status: state })
  }
  useEffect(() => {
    if (state.status === 'Success') {
      const receivedItemId = state.receipt?.logs
        .map(log => {
          try {
            return item.interface.parseLog(log)
          } catch (err) {
            // skip
          }
          return null
        })
        .find(e => e?.name === 'TransferSingle' && e.args[2] === account)?.args[3]
      if (receivedItemId) {
        api
          .getItem(receivedItemId, i18n.resolvedLanguage)
          .then(receivedItem => setUseItemState({ state: 'Success', status: state, receivedItem }))
      } else {
        setUseItemState({ state: 'Success', status: state })
      }
    } else {
      setUseItemState({ state: state.status, status: state })
    }
  }, [state, i18n])
  return { useItemState, use, resetUse }
}

export const takeOffItem = () => {
  const { OTTO_ITEM } = useContractAddresses()
  const { account } = useEthers()
  const otto = useOttoContract()
  const { state, send, resetState } = useContractFunction(otto, 'transferChild')
  const [receivedItem, setReceivedItem] = useState<Item | undefined>()
  const [takeOffState, setTakeOffState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })
  const takeOff = (item: Item, ottoId: string) => {
    setReceivedItem(item)
    send(ottoId, account || '', OTTO_ITEM, item.id)
  }
  const resetTakeOff = () => {
    resetState()
    setReceivedItem(undefined)
    setTakeOffState({
      state: 'None',
      status: state,
    })
  }
  useEffect(() => {
    if (state.status === 'Success') {
      setTakeOffState({ state: 'Success', status: state, receivedItem })
    } else {
      setTakeOffState({ state: state.status, status: state })
    }
  }, [state, receivedItem])
  return { takeOffState, takeOff, resetTakeOff }
}

interface OttoTransactionState {
  state: TransactionState
  status: TransactionStatus
}

interface OttoBuyTransactionState extends OttoTransactionState {
  receivedItems?: Item[]
}

export const useBuyProduct = (claim: boolean) => {
  const { CLAM, OTTOPIA_STORE } = useContractAddresses()
  const { account, library } = useEthers()
  const { i18n } = useTranslation()
  const api = useApi()
  const [factory, setFactory] = useState<Contract | undefined>()
  const clam = new Contract(CLAM, ERC20Abi, library?.getSigner())
  const store = useStoreContract()
  const { state, send, resetState } = useContractFunction(store, claim ? 'claimNoChainlink' : 'buyNoChainlink', {})
  const [buyState, setBuyState] = useState<OttoBuyTransactionState>({
    state: 'None',
    status: state,
  })
  const buy = async ({ id, discountPrice, factory: factoryAddr }: Product, ottoIds: string[]) => {
    setBuyState({
      state: 'PendingSignature',
      status: state,
    })
    setFactory(new Contract(factoryAddr, IOttoItemFactoryAbi, library))
    if (claim) {
      send(id, ottoIds, {
        gasLimit: 1000000,
      })
    } else {
      const clamAllowance = await clam.allowance(account, OTTOPIA_STORE)
      const noAllowance = clamAllowance.lt(discountPrice)
      if (noAllowance) {
        await (await clam.approve(OTTOPIA_STORE, constants.MaxUint256)).wait()
      }
      send(account || '', id, '1', {
        gasLimit: 1000000,
      })
    }
  }
  const resetBuy = () => {
    resetState()
    setBuyState({ state: 'None', status: state })
  }
  useEffect(() => {
    if (state.status === 'Success') {
      const IItem = new utils.Interface(OttoItemAbi)
      Promise.all(
        (state.receipt?.logs || [])
          .map(log => {
            try {
              return IItem.parseLog(log)
            } catch (err) {
              // skip
            }
            return null
          })
          .filter(e => e?.name === 'TransferSingle' && e.args[2] === account)
          .map(e => api.getItem(e?.args[3], i18n.resolvedLanguage))
      ).then(receivedItems =>
        setBuyState({
          state: 'Success',
          status: state,
          receivedItems,
        })
      )
    } else {
      setBuyState({ state: state.status, status: state })
    }
  }, [state, i18n, factory])
  return { buyState, buy, resetBuy }
}

export const useRedeemProduct = () => {
  const { OTTOPIA_STORE } = useContractAddresses()
  const { account, library } = useEthers()
  const { i18n } = useTranslation()
  const api = useApi()
  const [factory, setFactory] = useState<Contract | undefined>()
  const item = useItemContract()
  const { state, send, resetState } = useContractFunction(item, 'safeTransferFrom')
  const [redeemState, setRedeemState] = useState<OttoBuyTransactionState>({
    state: 'None',
    status: state,
  })
  const redeem = async (couponId: string, factoryAddr: string) => {
    if (account) {
      setRedeemState({
        state: 'PendingSignature',
        status: state,
      })
      setFactory(new Contract(factoryAddr, IOttoItemFactoryAbi, library))
      send(account, OTTOPIA_STORE, couponId, 1, [], { gasLimit: 1000000 })
    }
  }
  const resetRedeem = () => {
    resetState()
    setRedeemState({ state: 'None', status: state })
  }
  useEffect(() => {
    if (state.status === 'Success') {
      const IItem = new utils.Interface(OttoItemAbi)
      Promise.all(
        (state.receipt?.logs || [])
          .map(log => {
            try {
              return IItem.parseLog(log)
            } catch (err) {
              // skip
            }
            return null
          })
          .filter(e => e?.name === 'TransferSingle' && e.args[2] === account)
          .map(e => api.getItem(e?.args[3], i18n.resolvedLanguage))
      ).then(receivedItems =>
        setRedeemState({
          state: 'Success',
          status: state,
          receivedItems,
        })
      )
    } else {
      setRedeemState({ state: state.status, status: state })
    }
  }, [state, i18n, factory])
  return { redeemState, redeem, resetRedeem }
}

export const useClaimGiveaway = () => {
  const giveaway = useItemGiveaway()
  const { state: claimState, send, resetState: resetClaim } = useContractFunction(giveaway, 'claimGiveaway')
  const claim = ({
    itemId,
    amount,
    code,
    nonce,
    digest,
    signature,
  }: {
    itemId: number
    amount: number
    code: string
    nonce: string
    digest: string
    signature: string
  }) => send(itemId, amount, code, nonce, digest, signature)
  return { claimState, claim, resetClaim }
}

export const useStake = () => {
  const { CLAM, STAKING_PEARL_HELPER_ADDRESS } = useContractAddresses()
  const { account } = useEthers()
  const clam = useERC20(CLAM)
  const stakingPearlHelper = useStakingPearlHelper()
  const { state, send, resetState } = useContractFunction(stakingPearlHelper, 'stake', {})
  const [stakeState, setStakeState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })
  const stake = async (amount: string) => {
    try {
      const clamAmount = ethers.utils.parseUnits(amount, 9)
      setStakeState({
        state: 'PendingSignature',
        status: state,
      })
      const clamAllowance = account ? await clam.allowance(account, STAKING_PEARL_HELPER_ADDRESS) : constants.Zero
      const noAllowance = clamAllowance.lt(clamAmount)
      if (noAllowance) {
        await (await clam.approve(STAKING_PEARL_HELPER_ADDRESS, constants.MaxUint256)).wait()
      }
      send(clamAmount)
    } catch (error: any) {
      window.alert(error.message)
      setStakeState({ state: 'None', status: state })
    }
  }
  useEffect(() => {
    setStakeState({ state: state.status, status: state })
  }, [state])
  return { stakeState, stake, resetStake: resetState }
}

export const useUnstake = () => {
  const { PEARL, STAKING_PEARL_HELPER_ADDRESS } = useContractAddresses()
  const { account } = useEthers()
  const pearl = useERC20(PEARL)
  const stakingPearlHelper = useStakingPearlHelper()
  const { state, send, resetState } = useContractFunction(stakingPearlHelper, 'unstake', {})
  const [unstakeState, setUnstakeState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })
  const unstake = async (amount: string) => {
    try {
      const pearlAmount = ethers.utils.parseEther(amount)
      setUnstakeState({
        state: 'PendingSignature',
        status: state,
      })
      const allowance = account ? await pearl.allowance(account, STAKING_PEARL_HELPER_ADDRESS) : constants.Zero
      const noAllowance = allowance.lt(pearlAmount)
      if (noAllowance) {
        await (await pearl.approve(STAKING_PEARL_HELPER_ADDRESS, constants.MaxUint256)).wait()
      }
      send(pearlAmount)
    } catch (error: any) {
      window.alert(error.message)
      setUnstakeState({ state: 'None', status: state })
    }
  }
  useEffect(() => {
    setUnstakeState({ state: state.status, status: state })
  }, [state])
  return { unstakeState, unstake, resetState }
}
