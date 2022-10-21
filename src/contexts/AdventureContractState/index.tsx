import { BIG_NUM_ZERO } from 'constant'
import { BigNumber } from 'ethers'
import noop from 'lodash/noop'
import { createContext, PropsWithChildren, useContext, useMemo, useReducer } from 'react'
import { useTcpWatcher } from './tcp'

export interface AdventureContractState {
  walletTcp: BigNumber
}

const initialState: AdventureContractState = {
  walletTcp: BIG_NUM_ZERO,
}

export enum AdventureContractStateActionType {
  UpdateWalletTcp,
}

export type AdventureContractStateAction = { type: AdventureContractStateActionType.UpdateWalletTcp; data: BigNumber }

const AdventureContractStateContext = createContext<{
  dispatch: (action: AdventureContractStateAction) => void
  state: AdventureContractState
}>({
  dispatch: noop,
  state: initialState,
})

export const AdventureContractStateProvider = ({ children }: PropsWithChildren<object>) => {
  const [state, dispatch] = useReducer((state: AdventureContractState, action: AdventureContractStateAction) => {
    switch (action.type) {
      case AdventureContractStateActionType.UpdateWalletTcp:
        state = { ...state, walletTcp: action.data }
        break
      default:
        state
    }
    return state
  }, initialState)

  const value = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch])

  useTcpWatcher(dispatch)

  return <AdventureContractStateContext.Provider value={value}>{children}</AdventureContractStateContext.Provider>
}

export const useAdventureContractState = () => useContext(AdventureContractStateContext)
