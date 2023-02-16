import { TransactionState, TransactionStatus, useCall, useCalls, useContractFunction, useEthers } from '@usedapp/core'
import { useApi } from 'contexts/Api'
import { useRepositories } from 'contexts/Repositories'
import { BigNumber, BigNumberish, constants, ethers, utils } from 'ethers'
import useContractAddresses from 'hooks/useContractAddresses'
import { Api } from 'libs/api'
import last from 'lodash/last'
import { Item, ItemAction, ItemMetadata } from 'models/Item'
import { Mission } from 'models/Mission'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useState } from 'react'
import { ItemsRepository } from 'repositories/items'
import { OttoItemAbi } from './abis'
import {
  useAdventureContract,
  useClamPond,
  useERC1155,
  useERC20,
  useFoundry,
  useItemContract,
  useItemGiveaway,
  useMissionContract,
  useOttoContract,
  useOttoSummonerContract,
  usePearlBank,
  usePortalCreatorContract,
  useStoreContract,
} from './contracts'
import useOtterMine from './useOtterMine'
import { Adventure } from './__generated__'

export const useApprove = (tokenAddress?: string) => {
  const { CLAM } = useContractAddresses()
  const erc20 = useERC20(tokenAddress ?? CLAM)
  const { state: approveState, send: approve, resetState: resetApprove } = useContractFunction(erc20, 'approve')
  return { approveState, approve, resetApprove }
}

export const useMint = () => {
  const portal = usePortalCreatorContract()
  const { state: mintState, send: mint, resetState: resetMint } = useContractFunction(portal, 'mintWithMatic')
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
  receivedItem?: ItemMetadata
}

export const useItem = () => {
  const { OTTO } = useContractAddresses()
  const { account } = useEthers()
  const { i18n } = useTranslation()
  const { items: itemsRepo } = useRepositories()
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
      const receivedItemTokenId = state.receipt?.logs
        .map(log => {
          try {
            return item.interface.parseLog(log)
          } catch (err) {
            // skip
          }
          return null
        })
        .find(e => e?.name === 'TransferSingle' && e.args[2] === account)?.args[3]
      if (receivedItemTokenId) {
        itemsRepo
          .getMetadataList([receivedItemTokenId])
          .then(metadata => setUseItemState({ state: 'Success', status: state, receivedItem: metadata[0] }))
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
    send(ottoId, account || '', OTTO_ITEM, item.metadata.tokenId)
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
      setTakeOffState({ state: 'Success', status: state, receivedItem: receivedItem?.metadata })
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
  receivedItems?: ItemMetadata[]
}

export const useBuyProduct = () => {
  const { items: itemsRepo } = useRepositories()
  const { account } = useEthers()
  const { i18n } = useTranslation()
  const api = useApi()
  const store = useStoreContract()
  const { state, send, resetState } = useContractFunction(store, 'buyWithMatic', {})
  const [buyState, setBuyState] = useState<OttoBuyTransactionState>({
    state: 'None',
    status: state,
  })
  const buy = async ({ sellId, amount }: { sellId: number; amount: number }) => {
    if (account) {
      setBuyState({
        state: 'PendingSignature',
        status: state,
      })
      const data = await api.signBuyProduct({
        id: sellId,
        amount,
        from: account,
        to: account,
      })
      ;(send as any)(...data)
    }
  }
  const resetBuy = () => {
    resetState()
    setBuyState({ state: 'None', status: state })
  }
  useEffect(() => {
    if (state.status === 'Success') {
      const IItem = new utils.Interface(OttoItemAbi)
      const tokenIds = (state.receipt?.logs || [])
        .map(log => {
          try {
            return IItem.parseLog(log)
          } catch (err) {
            // skip
          }
          return null
        })
        .filter(e => e?.name === 'TransferSingle' && e.args[2] === account)
        .map(e => e?.args[3])

      itemsRepo.getMetadataList(tokenIds).then(receivedItems =>
        setBuyState({
          state: 'Success',
          status: state,
          receivedItems,
        })
      )
    } else {
      setBuyState({ state: state.status, status: state })
    }
  }, [state, i18n, account])
  return { buyState, buy, resetBuy }
}

export const useRedeemProduct = () => {
  const { items: itemsRepo } = useRepositories()
  const { account, library } = useEthers()
  const api = useApi()
  const store = useStoreContract()
  const item = useItemContract()
  const { state, send, resetState } = useContractFunction(store, 'openChest')
  const [redeemState, setRedeemState] = useState<OttoBuyTransactionState>({
    state: 'None',
    status: state,
  })
  const redeem = async (couponId: string) => {
    const signer = library?.getSigner()
    if (account && signer) {
      setRedeemState({
        state: 'PendingSignature',
        status: state,
      })
      const isApprovedForAll = await item.connect(signer).isApprovedForAll(account, store.address)
      if (!isApprovedForAll) {
        await (await item.setApprovalForAll(store.address, true)).wait()
      }
      const data = await api.signOpenChest({ from: account, to: account, itemId: Number(couponId) })
      ;(send as any)(...data, { gasLimit: 1000000 })
    }
  }
  const resetRedeem = () => {
    resetState()
    setRedeemState({ state: 'None', status: state })
  }
  useEffect(() => {
    if (state.status === 'Success') {
      const IItem = new utils.Interface(OttoItemAbi)
      const tokenIds = (state.receipt?.logs || [])
        .map(log => {
          try {
            return IItem.parseLog(log)
          } catch (err) {
            // skip
          }
          return null
        })
        .filter(e => e?.name === 'TransferSingle' && e.args[2] === account)
        .map(e => e?.args[3])
      itemsRepo.getMetadataList(tokenIds).then(receivedItems =>
        setRedeemState({
          state: 'Success',
          status: state,
          receivedItems,
        })
      )
    } else {
      setRedeemState({ state: state.status, status: state })
    }
  }, [state])
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
  const { items: itemsRepo } = useRepositories()
  const foundry = useFoundry()
  const { account } = useEthers()
  const api = useApi()
  const { state, send, resetState } = useContractFunction(foundry, 'fuse', {})
  const [forgeState, setForgeState] = useState<OttoBuyTransactionState>({
    state: 'None',
    status: state,
  })
  const forge = async (formulaId: number) => {
    if (account) {
      setForgeState({
        state: 'PendingSignature',
        status: state,
      })
      api.getForgeCalldata(formulaId, account).then(calldata => (send as any)(...calldata))
    }
  }
  useEffect(() => {
    if (state.status === 'Success') {
      parseReceivedItems({ itemsRepository: itemsRepo, receipt: state.receipt, api, account }).then(receivedItems =>
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
  return { forgeState, forge, resetForge: resetState }
}

function parseReceivedItems({
  itemsRepository,
  receipt,
  api,
  account,
}: {
  itemsRepository: ItemsRepository
  receipt?: ethers.providers.TransactionReceipt
  api: Api
  account?: string
}) {
  const IItem = new utils.Interface(OttoItemAbi)
  const tokenIds = (receipt?.logs || [])
    .map(log => {
      try {
        return IItem.parseLog(log)
      } catch (err) {
        // skip
      }
      return null
    })
    .filter(e => e?.name === 'TransferSingle' && e.args[2] === account)
    .map(e => e?.args[3])
  return itemsRepository.getMetadataList(tokenIds)
}

export const useSetApprovalForAll = (address: string) => {
  const erc1155 = useERC1155(address)
  return useContractFunction(erc1155, 'setApprovalForAll')
}

export type OttoTxState = 'None' | 'Processing' | 'Success' | 'Fail'

function txState(state: TransactionState): OttoTxState {
  switch (state) {
    case 'PendingSignature':
    case 'Mining':
      return 'Processing'
    case 'Success':
      return 'Success'
    case 'Fail':
    case 'Exception':
      return 'Fail'
    default:
      return 'None'
  }
}

export interface OttoTransactionWriteState {
  state: OttoTxState
  status: TransactionStatus
}

interface OttoAdventureExploreState extends OttoTransactionWriteState {
  passId?: string
  pass?: Adventure.PassStruct
}

export const useAdventureExplore = () => {
  const adventure = useAdventureContract()
  const otto = useOttoContract()
  const item = useItemContract()
  const { account, library } = useEthers()
  const [passId, setPassId] = useState<string | null>(null)
  const api = useApi()
  const { send: sendExplore, state, resetState } = useContractFunction(adventure, 'explore')
  const rawPassResult = useCall(
    passId && {
      contract: adventure,
      method: 'pass',
      args: [passId],
    }
  )
  const [exploreState, setExploreState] = useState<OttoAdventureExploreState>({
    state: 'None',
    status: state,
  })
  const {
    send: approveOttoSpending,
    state: approveOttoState,
    resetState: resetOtto,
  } = useContractFunction(otto, 'setApprovalForAll')
  const {
    send: approveItemSpending,
    state: approveItemState,
    resetState: resetItem,
  } = useContractFunction(item, 'setApprovalForAll')

  useEffect(() => {
    setExploreState({
      state: txState(approveOttoState.status),
      status: approveOttoState,
    })
  }, [approveOttoState])

  useEffect(() => {
    setExploreState({
      state: txState(approveItemState.status),
      status: approveItemState,
    })
  }, [approveItemState])

  useEffect(() => {
    if (state.status === 'Success' && state.receipt) {
      const passId = state.receipt.logs
        .map(log => {
          try {
            return adventure.interface.parseLog(log)
          } catch (err) {
            // skip
          }
          return null
        })
        .filter(e => e?.name === 'Departure')[0]?.args[0]
      setPassId(passId)
    } else {
      setExploreState({
        state: txState(state.status),
        status: state,
      })
    }
  }, [state])

  useEffect(() => {
    if (passId && rawPassResult?.value?.[0].canFinishAt.gt(0)) {
      setExploreState({
        state: 'Success',
        status: state,
        passId,
        pass: rawPassResult?.value?.[0],
      })
      setPassId(null)
    }
  }, [passId, rawPassResult])

  const resetExplore = () => {
    resetItem()
    resetOtto()
    resetState()
  }

  const explore = useCallback(
    async (ottoId: string, locationId: number, itemActions: ItemAction[]) => {
      if (!account || !library) {
        return
      }
      setExploreState({
        state: 'Processing',
        status: state,
      })

      const ottoApproved = await otto.isApprovedForAll(account, adventure.address)
      if (!ottoApproved) {
        const tx = await approveOttoSpending(adventure.address, true)
        if (!tx) {
          return
        }
      }

      const itemApproved = await item.isApprovedForAll(account, adventure.address)
      if (!itemApproved) {
        const tx = await approveItemSpending(adventure.address, true)
        if (!tx) {
          return
        }
      }
      const data = await api.explore(ottoId, locationId, account, itemActions)
      sendExplore(...data)
    },
    [account, library, state, otto, item, api, sendExplore]
  )

  return {
    explore,
    exploreState,
    resetExplore,
  }
}

export const useAdventureFinish = () => {
  const api = useApi()
  const adventure = useAdventureContract()
  const { account } = useEthers()
  const { send, state, resetState } = useContractFunction(adventure, 'finish')
  const [finishState, setFinishState] = useState<OttoTransactionWriteState>({ status: state, state: 'None' })
  const [result, setResult] = useState<
    | {
        restingUntil: Date
      }
    | undefined
  >()

  useEffect(() => {
    setFinishState({ status: state, state: txState(state.status) })
  }, [state])

  const finish = useCallback(
    (ottoId: string, immediately: boolean, potions: number[]) => {
      if (!account) {
        return
      }
      setFinishState({ status: state, state: 'Processing' })
      api.finish({ ottoId, wallet: account, immediately, potions }).then(inputs => (send as any)(...inputs))
    },
    [api, account, send, state]
  )

  useEffect(() => {
    if (state.status === 'Success') {
      const result = { restingUntil: new Date() }

      ;(state.receipt?.logs ?? []).forEach(raw => {
        try {
          const log = adventure.interface.parseLog(raw)
          if (log.name === 'RestingUntilUpdated') {
            result.restingUntil = new Date(BigNumber.from(log.args.restingUntil).toNumber() * 1000)
          }
        } catch (err) {
          // skip
        }
      })

      setResult(result)
    }
  }, [state.status])

  const reset = useCallback(() => {
    resetState()
    setResult(undefined)
  }, [])

  return { finishState, finish, resetFinish: reset, finishResult: result }
}

export const useAdventureRevive = () => {
  const adventure = useAdventureContract()
  const { send, state, resetState } = useContractFunction(adventure, 'revive')
  return { reviveState: state, revive: send, resetRevive: resetState }
}

export const useUseAttributePoints = () => {
  const otto = useOttoContract()
  const { send, state, resetState } = useContractFunction(otto, 'useAttributePoints')
  return { useAttributePointsState: state, useAttributePoints: send, resetUseAttributePoints: resetState }
}

export const useBuyFish = () => {
  const store = useStoreContract()
  const { state, send, resetState } = useContractFunction(store, 'buyFishWithMatic', {})

  const [buyFishState, setBuyFishState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })

  const buyFish = async (amountIn: BigNumber) => {
    setBuyFishState({
      state: 'PendingSignature',
      status: state,
    })
    send({ value: amountIn })
  }

  const resetBuyFish = () => {
    resetState()
    setBuyFishState({ state: 'None', status: state })
  }

  useEffect(() => {
    if (state.status === 'Success') {
      setBuyFishState({
        state: 'Success',
        status: state,
      })
    } else {
      setBuyFishState({ state: state.status, status: state })
    }
  }, [state])

  return { buyFishState, buyFish, resetBuyFish }
}

export const useTransferItem = () => {
  const { account } = useEthers()
  const item = useItemContract()
  const { state, send, resetState } = useContractFunction(item, 'safeTransferFrom')
  const transfer = useCallback(
    (itemId: string, to: string, amount: number) => send(account || '', to, itemId, amount, []),
    [account, send]
  )
  return { transferState: state, transfer, resetTransfer: resetState }
}

export const useUsePotions = () => {
  const adventure = useAdventureContract()
  return useContractFunction(adventure, 'usePotions')
}

interface OttoDoItemTransactionState {
  state: OttoTxState
  status: TransactionStatus
  restingUntil?: Date
}

export const useDoItemBatchActions = () => {
  const otto = useOttoContract()
  const adventure = useAdventureContract()
  const item = useItemContract()
  const { account } = useEthers()
  const { state, send, resetState } = useContractFunction(otto, 'doItemBatchActions')
  const [doItemBatchActionsState, setDoItemBatchActionsState] = useState<OttoDoItemTransactionState>({
    status: state,
    state: 'None',
  })
  const {
    send: approveItemSpending,
    state: approveItemState,
    resetState: resetItem,
  } = useContractFunction(item, 'setApprovalForAll')
  useEffect(() => {
    setDoItemBatchActionsState({
      state: txState(state.status),
      status: state,
    })
  }, [approveItemState])
  useEffect(() => {
    if (state.status === 'Success' && state.receipt) {
      const restingUntil = last(
        state.receipt.logs
          .map(log => {
            try {
              return adventure.interface.parseLog(log)
            } catch (err) {
              // skip
            }
            return null
          })
          .filter(e => e?.name === 'RestingUntilUpdated')
      )?.args[1]
      setDoItemBatchActionsState({
        state: 'Success',
        status: state,
        restingUntil: restingUntil ? new Date(restingUntil.toNumber() * 1000) : undefined,
      })
    } else {
      setDoItemBatchActionsState({
        state: txState(state.status),
        status: state,
      })
    }
  }, [state])
  const doItemBatchActions = useCallback(
    async (ottoId: string, actions: ItemAction[]) => {
      if (!account) {
        return
      }
      const approved = await item.isApprovedForAll(account, otto.address)
      if (!approved) {
        const tx = await approveItemSpending(otto.address, true)
        if (!tx) return
      }
      send(
        ottoId,
        actions.map(({ type, item_id, from_otto_id }) => ({
          typ: type,
          itemId: item_id,
          fromOttoId: from_otto_id,
        })),
        { gasLimit: 2000000 }
      )
    },
    [send, item]
  )
  const resetDoItemBatchActions = useCallback(() => {
    resetState()
    resetItem()
  }, [resetState, resetItem])
  return { doItemBatchActionsState, doItemBatchActions, resetDoItemBatchActions }
}

export const useBuyFishItem = () => {
  const { FISH, OTTOPIA_STORE } = useContractAddresses()
  const store = useStoreContract()
  const { account, library } = useEthers()
  const api = useApi()
  const fish = useERC20(FISH)
  const { approve, approveState, resetApprove } = useApprove(FISH)
  const { send: sendBuy, state, resetState } = useContractFunction(store, 'buySigned')
  const [buyState, setBuyState] = useState<OttoTransactionWriteState>({
    state: 'None',
    status: state,
  })
  useEffect(() => {
    if (approveState.status !== 'Success') {
      setBuyState({
        state: txState(approveState.status),
        status: approveState,
      })
    }
  }, [approveState])
  useEffect(() => {
    setBuyState({
      state: txState(state.status),
      status: state,
    })
  }, [state])
  const resetBuy = () => {
    resetApprove()
    resetState()
  }

  const buy = useCallback(
    async (productId: number, price: BigNumberish) => {
      if (!account || !library) {
        return
      }
      setBuyState({
        state: 'Processing',
        status: state,
      })

      const allowance = await fish.allowance(account, OTTOPIA_STORE)
      if (allowance.lt(price)) {
        const tx = await approve(OTTOPIA_STORE, constants.MaxUint256)
        if (!tx) {
          return
        }
      }
      try {
        const data = await api.signFishStoreProduct({ from: account, to: account, productId })
        ;(sendBuy as any)(...data)
      } catch (err: any) {
        setBuyState({
          state: 'Fail',
          status: {
            ...state,
            errorMessage: err.message,
          },
        })
      }
    },
    [account, library, state, OTTOPIA_STORE, api, sendBuy, approve]
  )

  return {
    buy,
    buyState,
    resetBuy,
  }
}

export const useCompleteMission = () => {
  const mission = useMissionContract()
  const item = useItemContract()
  const { account } = useEthers()
  const api = useApi()
  const { state, send, resetState } = useContractFunction(mission, 'complete', {})
  const {
    state: approveState,
    send: approve,
    resetState: resetApprove,
  } = useContractFunction(item, 'setApprovalForAll', {})
  const [completeMissionState, setCompleteMissionState] = useState<OttoTransactionWriteState>({
    state: 'None',
    status: state,
  })
  const complete = useCallback(
    async (missionId: number) => {
      if (account) {
        setCompleteMissionState({
          state: 'Processing',
          status: state,
        })
        try {
          const approved = await item.isApprovedForAll(account, mission.address)
          if (!approved) {
            await approve(mission.address, true)
          }
          const tx = await api.completeMission({ account, missionId }).then(calldata => (send as any)(...calldata))
          if (tx) {
            await api.confirm({ missionId, tx: tx.transactionHash })
            setCompleteMissionState({
              state: 'Success',
              status: state,
            })
          }
        } catch (err: any) {
          setCompleteMissionState({
            state: 'Fail',
            status: {
              ...state,
              errorMessage: err.message,
            },
          })
        }
      }
    },
    [account, api, approve, item, mission.address, send, state]
  )
  const resetCompleteMission = useCallback(() => {
    resetApprove()
    resetState()
  }, [resetApprove, resetState])
  useEffect(() => {
    if (approveState.status === 'Exception' || approveState.status === 'Fail') {
      setCompleteMissionState({
        state: 'Fail',
        status: approveState,
      })
    } else if (state.status !== 'Success') {
      setCompleteMissionState({
        state: txState(state.status),
        status: state,
      })
    }
  }, [account, api, state, approveState])
  return { completeMissionState, complete, resetCompleteMission }
}

export interface OttoNewMissionState extends OttoTransactionWriteState {
  mission?: Mission
}

export const useRequestNewMission = () => {
  const { account } = useEthers()
  const { i18n } = useTranslation()
  const api = useApi()
  const store = useStoreContract()
  const { state, send, resetState } = useContractFunction(store, 'payWithMatic', {})
  const [buyState, setBuyState] = useState<OttoNewMissionState>({
    state: 'None',
    status: state,
  })
  const buy = useCallback(
    async (key: string, price: string) => {
      setBuyState({
        state: 'Processing',
        status: state,
      })
      send(key, 1, { value: price })
    },
    [account, send, state]
  )
  useEffect(() => {
    if (state.status === 'Success') {
      api
        .requestNewMission({ account: account || '', tx: state.transaction?.hash || '' })
        .then(mission =>
          setBuyState({
            state: 'Success',
            status: state,
            mission,
          })
        )
        .catch((err: any) =>
          setBuyState({
            state: 'Fail',
            status: {
              ...state,
              errorMessage: err.message,
            },
          })
        )
    } else {
      setBuyState({ state: txState(state.status), status: state })
    }
  }, [state, i18n, api, account])
  return { buyState, buy, resetBuy: resetState }
}

export const useRefreshMission = (missionId: number) => {
  const { account } = useEthers()
  const { i18n } = useTranslation()
  const api = useApi()
  const store = useStoreContract()
  const { state, send, resetState } = useContractFunction(store, 'payWithMatic', {})
  const [refreshState, setBuyState] = useState<OttoNewMissionState>({
    state: 'None',
    status: state,
  })
  const refresh = useCallback(
    async (key: string, price: string) => {
      setBuyState({
        state: 'Processing',
        status: state,
      })
      send(key, 1, { value: price })
    },
    [account, send, state]
  )
  useEffect(() => {
    if (state.status === 'Success' && account && state.transaction?.hash) {
      api
        .refreshMission({ account, missionId, tx: state.transaction.hash })
        .then(mission =>
          setBuyState({
            state: 'Success',
            status: state,
            mission,
          })
        )
        .catch((err: any) =>
          setBuyState({
            state: 'Fail',
            status: {
              ...state,
              errorMessage: err.message,
            },
          })
        )
    } else {
      setBuyState({ state: txState(state.status), status: state })
    }
  }, [state, i18n, api, account, missionId])
  return { refreshState, refresh, resetRefresh: resetState }
}

export const useMine = () => {
  const otterMine = useOtterMine()
  const { CLAM } = useContractAddresses()
  const { account } = useEthers()
  const clam = useERC20(CLAM)
  const { state, send, resetState } = useContractFunction(otterMine, 'mine', {})
  const [mineState, setMineState] = useState<OttoTransactionState>({
    state: 'None',
    status: state,
  })
  const mine = async (amount: string) => {
    try {
      const clamAmount = ethers.utils.parseUnits(amount, 9)
      setMineState({
        state: 'PendingSignature',
        status: state,
      })
      const clamAllowance = account ? await clam.allowance(account, otterMine.address) : constants.Zero
      const noAllowance = clamAllowance.lt(clamAmount)
      if (noAllowance) {
        await (await clam.approve(otterMine.address, constants.MaxUint256)).wait()
      }
      send(clamAmount)
    } catch (error: any) {
      window.alert(error.message)
      setMineState({ state: 'None', status: state })
    }
  }
  useEffect(() => {
    setMineState({ state: state.status, status: state })
  }, [state])
  return { mineState, mine, resetMine: resetState }
}
