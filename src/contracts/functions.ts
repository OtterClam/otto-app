import { TransactionState, TransactionStatus, useCalls, useContractFunction, useEthers } from '@usedapp/core'
import { BigNumber, constants, Contract, ethers, utils } from 'ethers'
import { useApi } from 'contexts/Api'
import useContractAddresses from 'hooks/useContractAddresses'
import Item from 'models/Item'
import Product from 'models/store/Product'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useState } from 'react'
import { Api } from 'libs/api'
import { ERC20Abi, IOttoItemFactoryAbi, OttoItemAbi } from './abis'
import {
  useAdventureContract,
  useClamPond,
  useERC1155,
  useERC20,
  useFoundry,
  useItemContract,
  useItemGiveaway,
  useOttoContract,
  useOttoSummonerContract,
  usePearlBank,
  usePortalCreatorContract,
  useStoreContract,
} from './contracts'
import { useIsApprovedForAll } from './views'

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
          .getItem(receivedItemId)
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

export const useTakeOffItem = () => {
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

export interface OttoBuyTransactionState extends OttoTransactionState {
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
          .map(e => api.getItem(e?.args[3]))
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
          .map(e => api.getItem(e?.args[3]))
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
  const pearlBank = usePearlBank()
  const { CLAM, PEARL_BANK } = useContractAddresses()
  const { account } = useEthers()
  const clam = useERC20(CLAM)
  const { state, send, resetState } = useContractFunction(pearlBank, 'stake', {})
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
      const clamAllowance = account ? await clam.allowance(account, PEARL_BANK) : constants.Zero
      const noAllowance = clamAllowance.lt(clamAmount)
      if (noAllowance) {
        await (await clam.approve(PEARL_BANK, constants.MaxUint256)).wait()
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
  const pearlBank = usePearlBank()
  const { state, send, resetState } = useContractFunction(pearlBank, 'withdraw', {})
  const [unstakeState, setUnstakeState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })
  const unstake = async (amount: string) => {
    try {
      const clamAmount = ethers.utils.parseUnits(amount, 9)
      setUnstakeState({
        state: 'PendingSignature',
        status: state,
      })
      send(clamAmount)
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

export const useClaimRewards = () => {
  const pearlBank = usePearlBank()
  const { send } = useContractFunction(pearlBank, 'claimRewards', {})
  return send
}

export function useStakedInfo() {
  const pearlBank = usePearlBank()
  const { account } = useEthers()

  const [result] = useCalls([
    account && {
      contract: pearlBank,
      method: 'otterInfo',
      args: [account],
    },
  ])

  return {
    amount: result?.value?.amount ?? BigNumber.from(0),
    timestamp: result?.value?.timestamp ?? BigNumber.from(0),
  }
}

export function usePearlBankBalance(): BigNumber {
  const pearlBank = usePearlBank()
  const { account } = useEthers()

  const [result] = useCalls([
    account && {
      contract: pearlBank,
      method: 'balanceOf',
      args: [account],
    },
  ])

  return result?.value ? result?.value[0] : BigNumber.from(0)
}

export function useClamPerPearl() {
  const pearlBank = usePearlBank()
  const { account } = useEthers()

  const [totalStakedResult, totalSupplyResult] = useCalls([
    account && {
      contract: pearlBank,
      method: 'totalStaked',
      args: [account],
    },
    account && {
      contract: pearlBank,
      method: 'totalSupply',
      args: [],
    },
  ])

  const totalStakedOfClam = totalStakedResult?.value ? totalStakedResult?.value[0] : BigNumber.from(0)
  const totalSupplyOfPearl = totalSupplyResult?.value ? totalSupplyResult?.value[0] : BigNumber.from(0)

  return totalSupplyOfPearl.eq(0) ? BigNumber.from(0) : totalStakedOfClam.div(totalSupplyOfPearl)
}

export type ClamPondToken = 'CLAM' | 'PEARL'

export const useClamPondDeposit = (token: ClamPondToken) => {
  const clamPond = useClamPond()
  const { account } = useEthers()
  const { CLAM, PEARL_BANK, CLAM_POND } = useContractAddresses()
  const tokenAddress = token === 'CLAM' ? CLAM : PEARL_BANK
  const tokenERC20 = useERC20(tokenAddress)
  const { state, send, resetState } = useContractFunction(clamPond, token === 'CLAM' ? 'deposit' : 'depositPearl', {})
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
      const clamAllowance = account ? await tokenERC20.allowance(account, CLAM_POND) : constants.Zero
      const noAllowance = clamAllowance.lt(clamAmount)
      if (noAllowance) {
        await (await tokenERC20.approve(CLAM_POND, constants.MaxUint256)).wait()
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

export const useClamPondWithdraw = (token: ClamPondToken) => {
  const clamPond = useClamPond()
  const { state, send, resetState } = useContractFunction(clamPond, token === 'CLAM' ? 'withdraw' : 'withdrawPearl', {})
  const [unstakeState, setUnstakeState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })
  const unstake = async (amount: string) => {
    try {
      const clamAmount = ethers.utils.parseUnits(amount, 9)
      setUnstakeState({
        state: 'PendingSignature',
        status: state,
      })
      send(clamAmount)
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

export const useForge = () => {
  const foundry = useFoundry()
  const { account } = useEthers()
  const api = useApi()
  const { state, send, resetState } = useContractFunction(foundry, 'forge', {})
  const [forgeState, setForgeState] = useState<OttoBuyTransactionState>({
    state: 'None',
    status: state,
  })
  const forge = async (formulaId: number, amount: number) => {
    setForgeState({
      state: 'PendingSignature',
      status: state,
    })
    send(formulaId, amount)
  }
  const resetForge = () => {
    resetState()
    setForgeState({ state: 'None', status: state })
  }
  useEffect(() => {
    if (state.status === 'Success') {
      parseReceivedItems({ receipt: state.receipt, api, account }).then(receivedItems =>
        setForgeState({
          state: 'Success',
          status: state,
          receivedItems,
        })
      )
    } else {
      setForgeState({ state: state.status, status: state })
    }
  }, [account, api, state])
  return { forgeState, forge, resetForge }
}

function parseReceivedItems({
  receipt,
  api,
  account,
}: {
  receipt?: ethers.providers.TransactionReceipt
  api: Api
  account?: string
}) {
  const IItem = new utils.Interface(OttoItemAbi)
  return Promise.all(
    (receipt?.logs || [])
      .map(log => {
        try {
          return IItem.parseLog(log)
        } catch (err) {
          // skip
        }
        return null
      })
      .filter(e => e?.name === 'TransferSingle' && e.args[2] === account)
      .map(e => api.getItem(e?.args[3]))
  )
}

export const useSetApprovalForAll = (address: string) => {
  const erc1155 = useERC1155(address)
  return useContractFunction(erc1155, 'setApprovalForAll')
}

export const useAdventureDeparture = () => {
  const { OTTO, OTTO_ITEM } = useContractAddresses()
  const [loading, setLoading] = useState(false)
  const adventure = useAdventureContract()
  const { account, library } = useEthers()
  const api = useApi()
  const { isApprovedForAll: ottoApproved } = useIsApprovedForAll(OTTO, account ?? '', adventure.address)
  const { isApprovedForAll: itemApproved } = useIsApprovedForAll(OTTO_ITEM, account ?? '', adventure.address)
  const { send: sendDeparture, state: departureState } = useContractFunction(adventure, 'departure')
  const { send: sendApproveOtto, state: approveOttoState } = useSetApprovalForAll(OTTO)
  const { send: snedApproveOttoItem, state: approveItemState } = useSetApprovalForAll(OTTO_ITEM)
  const [readyToGo, setReadyToGo] = useState(false)

  const departure = useCallback(
    (ottoId: string, locationId: number) => {
      if (!account || !library) {
        return
      }
      setLoading(true)
      console.log(ottoApproved, itemApproved)
      Promise.resolve()
        .then(() => {
          if (!ottoApproved) {
            return sendApproveOtto(adventure.address, true)
          }
        })
        .then(() => {
          if (!itemApproved) {
            return snedApproveOttoItem(adventure.address, true)
          }
        })
        .then(() => api.departure(ottoId, locationId, account))
        .then(inputs => sendDeparture(...inputs))
        .then(() => setReadyToGo(true))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    },
    [api, account, ottoApproved, itemApproved]
  )

  return {
    loading,
    departure,
    readyToGo,
    // readyToGo: departureState.status === 'Success' && approveOttoState.status === 'Success' && approveItemState.status === 'Success',
  }
}

export const useAdventureFinish = () => {
  const api = useApi()
  const adventure = useAdventureContract()
  const { account } = useEthers()
  const { send, state, resetState } = useContractFunction(adventure, 'finish')
  const [finishState, setFinishState] = useState<OttoTransactionState>({ status: state, state: 'None' })

  useEffect(() => {
    setFinishState({ status: state, state: state.status })
  }, [state])

  const finish = useCallback(
    (ottoId: string, immediately: boolean, potions: string[]) => {
      if (!account) {
        return
      }
      setFinishState({ status: state, state: 'PendingSignature' })
      api.finish({ ottoId, wallet: account, immediately, potions }).then(inputs => (send as any)(...inputs))
    },
    [api, account, send, state]
  )

  return { finishState, finish, resetFinish: resetState }
}

export const useAdventureRevive = () => {
  const adventure = useAdventureContract()
  const { send, state, resetState } = useContractFunction(adventure, 'revive')
  return { reviveState: state, revive: send, resetRevive: resetState }
}
