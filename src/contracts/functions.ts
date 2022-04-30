import { TransactionState, TransactionStatus, useContractFunction, useEthers } from '@usedapp/core'
import { Contract, ContractReceipt, utils, constants } from 'ethers'
import useApi from 'hooks/useApi'
import useContractAddresses from 'hooks/useContractAddresses'
import Item from 'models/Item'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Product from 'models/store/Product'
import { ERC20, IOttoItemFactory, Otto, OttoItemAbi, OttopiaPortalCreator, OttopiaStoreAbi, OttoSummoner } from './abis'

type Token = 'clam' | 'eth'

export const useApprove = (token: Token) => {
  const { WETH, CLAM } = useContractAddresses()
  const { library } = useEthers()
  const erc20 = new Contract(token === 'clam' ? CLAM : WETH, ERC20, library)
  const { state: approveState, send: approve, resetState: resetApprove } = useContractFunction(erc20, 'approve')
  return { approveState, approve, resetApprove }
}

export const useMint = () => {
  const { PORTAL_CREATOR } = useContractAddresses()
  const { library } = useEthers()
  const portal = new Contract(PORTAL_CREATOR, OttopiaPortalCreator, library)
  const { state: mintState, send: mint, resetState: resetMint } = useContractFunction(portal, 'mint')
  return { mintState, mint, resetMint }
}

export const useOpenPortal = () => {
  const { SUMMONER } = useContractAddresses()
  const { library } = useEthers()
  const summoner = new Contract(SUMMONER, OttoSummoner, library)
  const { state: openState, send: open, resetState: resetOpen } = useContractFunction(summoner, 'requestOpen')
  return { openState, open, resetOpen }
}

export const useSummonOtto = () => {
  const { SUMMONER } = useContractAddresses()
  const { library } = useEthers()
  const summoner = new Contract(SUMMONER, OttoSummoner, library)
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
  const { OTTO, OTTO_ITEM } = useContractAddresses()
  const { account, library } = useEthers()
  const { i18n } = useTranslation()
  const api = useApi()
  const item = new Contract(OTTO_ITEM, OttoItemAbi, library)
  const { state, send, resetState } = useContractFunction(item, 'transferToParent')
  const [useItemState, setUseItemState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })
  const use = (itemId: string, ottoId: string) => send(account, OTTO, ottoId, itemId, [])
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
  const { OTTO, OTTO_ITEM } = useContractAddresses()
  const { account, library } = useEthers()
  const otto = new Contract(OTTO, Otto, library)
  const { state, send, resetState } = useContractFunction(otto, 'transferChild')
  const [receivedItem, setReceivedItem] = useState<Item | undefined>()
  const [takeOffState, setTakeOffState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })
  const takeOff = (item: Item, ottoId: string) => {
    setReceivedItem(item)
    send(ottoId, account, OTTO_ITEM, item.id, [])
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

export const useBuyProduct = () => {
  const { CLAM, OTTOPIA_STORE } = useContractAddresses()
  const { account, library } = useEthers()
  const { i18n } = useTranslation()
  const api = useApi()
  const [factory, setFactory] = useState<Contract | undefined>()
  const clam = new Contract(CLAM, ERC20, library?.getSigner())
  const store = new Contract(OTTOPIA_STORE, OttopiaStoreAbi, library)
  const { state, send, resetState } = useContractFunction(store, 'buy')
  const [buyState, setBuyState] = useState<OttoBuyTransactionState>({
    state: 'None',
    status: state,
  })
  const buy = async ({ id, discountPrice, factory: factoryAddr }: Product) => {
    setBuyState({
      state: 'PendingSignature',
      status: state,
    })
    setFactory(new Contract(factoryAddr, IOttoItemFactory, library))
    const clamAllowance = await clam.allowance(account, OTTOPIA_STORE)
    const noAllowance = clamAllowance.lt(discountPrice)
    if (noAllowance) {
      await (await clam.approve(OTTOPIA_STORE, constants.MaxUint256)).wait()
    }
    send(account, id, '1')
  }
  const resetBuy = () => {
    resetState()
    setBuyState({ state: 'None', status: state })
  }
  useEffect(() => {
    if (state.status === 'Success') {
      const orderId = state.receipt?.logs
        .map(log => {
          try {
            return factory?.interface.parseLog(log)
          } catch (err) {
            // skip
          }
          return null
        })
        .find(e => e?.name === 'CreateOrder')?.args[0]
      console.log(`order id: ${orderId}`)
      if (orderId && factory) {
        const event = factory.filters.ShipOrder(orderId)
        factory.once(event, async (orderId, buyer, event) => {
          // console.log(`==== order shipped ${orderId} ====`)
          // console.log(event)
          const IItem = new utils.Interface(OttoItemAbi)
          const receipt = (await event.getTransactionReceipt()) as ContractReceipt
          const receivedItems = await Promise.all(
            receipt.logs
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
          )
          setBuyState({
            state: 'Success',
            status: state,
            receivedItems,
          })
        })
      }
    } else {
      setBuyState({ state: state.status, status: state })
    }
  }, [state, i18n, factory])
  return { buyState, buy, resetBuy }
}
