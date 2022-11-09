import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Otto from 'models/Otto'
import { RootState } from '.'

export type MintStatus = 'init' | 'minting' | 'success'

interface UiState {
  connectingWallet: boolean
  mintStatus: MintStatus
  mintNumber: number
  showSideMenu: boolean
  showWalletPopup: boolean
  showFishWalletPopup: boolean
  ottoInTheHell?: ReturnType<Otto['toJSON']>
  itemDetailsPopup?: string // item token id
  ottoPopup?: string // otto token id
}

const initialState: UiState = {
  connectingWallet: false,
  mintStatus: 'init',
  mintNumber: 0,
  showSideMenu: false,
  showWalletPopup: false,
  showFishWalletPopup: false,
  ottoInTheHell: undefined,
  itemDetailsPopup: undefined,
  ottoPopup: undefined,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    connectWallet: state => {
      state.connectingWallet = true
    },
    walletConnected: state => {
      state.connectingWallet = false
    },
    mintStart: state => {
      state.mintStatus = 'minting'
    },
    mintSuccess: (state, action) => {
      state.mintStatus = 'success'
      state.mintNumber = action.payload
    },
    mintFailed: state => {
      state.mintStatus = 'init'
    },
    mintReset: state => {
      state.mintStatus = 'init'
    },
    showSideMenu: state => {
      state.showSideMenu = true
    },
    hideSideMenu: state => {
      state.showSideMenu = false
    },
    showDicePopup: (state, action) => {
      state.ottoInTheHell = action.payload
    },
    hideDicePopup: state => {
      state.ottoInTheHell = undefined
    },
    showWalletPopup: state => {
      state.showWalletPopup = true
    },
    hideWalletPopup: state => {
      state.showWalletPopup = false
    },
    showFishWalletPopup: state => {
      state.showFishWalletPopup = true
    },
    hideFishWalletPopup: state => {
      state.showFishWalletPopup = false
    },
    showItemDetailsPopup: (state, action) => {
      state.itemDetailsPopup = action.payload
    },
    hideItemDetailsPopup: state => {
      state.itemDetailsPopup = undefined
    },
    showOttoPopup: (state, action) => {
      state.ottoPopup = action.payload
    },
    hideOttoPopup: state => {
      state.ottoPopup = undefined
    },
  },
})

export const {
  connectWallet,
  walletConnected,
  mintStart,
  mintSuccess,
  mintFailed,
  mintReset,
  showSideMenu,
  hideSideMenu,
  showDicePopup,
  hideDicePopup,
  showWalletPopup,
  hideWalletPopup,
  showFishWalletPopup,
  hideFishWalletPopup,
  showItemDetailsPopup,
  hideItemDetailsPopup,
  showOttoPopup,
  hideOttoPopup,
} = uiSlice.actions

export const selectConnectingWallet = (state: RootState) => state.ui.connectingWallet

export const selectMintStatus = (state: RootState) => state.ui.mintStatus

export const selectMintNumber = (state: RootState) => state.ui.mintNumber

export const selectShowSideMenu = (state: RootState) => state.ui.showSideMenu

export const selectShowWalletPopup = (state: RootState) => state.ui.showWalletPopup

export const selectShowFishWalletPopup = (state: RootState) => state.ui.showFishWalletPopup

export const selectItemDetailsPopup = (state: RootState) => state.ui.itemDetailsPopup

export const selectOttoInTheHell = (state: RootState) => {
  if (!state.ui.ottoInTheHell) {
    return
  }
  return Otto.fromJSON(state.ui.ottoInTheHell)
}

export const selectOttoPopup = (state: RootState) => state.ui.ottoPopup

export default uiSlice.reducer
