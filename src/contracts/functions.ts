import { TransactionState, TransactionStatus, useContractFunction, useEthers } from '@usedapp/core'
import { constants, Contract, utils } from 'ethers'
import useApi from 'hooks/useApi'
import useContractAddresses from 'hooks/useContractAddresses'
import Item from 'models/Item'
import Product from 'models/store/Product'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ERC20Abi, IOttoItemFactoryAbi, OttoItemAbi } from './abis'
import {
  useERC20,
  useItemContract,
  useOttoContract,
  useOttoSummonerContract,
  usePortalCreatorContract,
  useStoreContract,
} from './contracts'

export const useApprove = () => {
  const { CLAM } = useContractAddresses()
  const erc20 = useERC20(CLAM)
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
  const { SUMMONER } = useContractAddresses()
  const { library } = useEthers()
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

interface OttoBuyTransactionState {
  state: TransactionState
  status: TransactionStatus
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
  const { state, send, resetState } = useContractFunction(store, claim ? 'claimNoChainlink' : 'buyNoChainlink')
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
