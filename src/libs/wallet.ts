import { Erc20__factory } from 'contracts/__generated__'
import { Erc20, TransferEventFilter } from 'contracts/__generated__/Erc20'
import { BigNumber, providers } from 'ethers'
import noop from 'lodash/noop'
import debounce from 'lodash/debounce'
import EventEmitter from 'events'

export interface WalletOptions {
  ethersProvider: providers.Provider
  accountAddress: string
}

export interface TokenInfo {
  decimals: number
  balance: BigNumber
  contract: Erc20
  transferEventListender: providers.Listener
}

export default class Wallet extends EventEmitter {
  private tokenInfo = new Map<string, TokenInfo>()

  private ethersProvider: providers.Provider

  private accountAddress: string

  constructor(options: WalletOptions) {
    super()
    this.ethersProvider = options.ethersProvider
    this.accountAddress = options.accountAddress
  }

  destroy() {
    Array.from(this.tokenInfo).forEach(([, info]) => {
      const eventFilter = this.getTokenTransferEventFilter(info.contract)
      this.ethersProvider.off(eventFilter, info.transferEventListender)
    })
  }

  private getTokenTransferEventFilter(token: Erc20): TransferEventFilter {
    return token.filters.Transfer(null, this.accountAddress)
  }

  async trackTokenBalance(tokenAddress: string): Promise<void> {
    if (this.tokenInfo.has(tokenAddress)) {
      return
    }

    const info: TokenInfo = {
      balance: BigNumber.from(0),
      decimals: 0,
      contract: Erc20__factory.connect(tokenAddress, this.ethersProvider),
      transferEventListender: debounce(this.handleTokenTransferEvent.bind(this, tokenAddress), 500),
    }

    this.tokenInfo.set(tokenAddress, info)

    const eventFilter = this.getTokenTransferEventFilter(info.contract)
    this.ethersProvider.on(eventFilter, this.handleTokenTransferEvent)

    const [decimals, balance] = await Promise.all([
      info.contract.decimals(),
      info.contract.balanceOf(this.accountAddress),
    ])
    info.decimals = decimals
    info.balance = balance

    this.emit('balanceUpdated', tokenAddress, info.balance)
  }

  private async handleTokenTransferEvent(tokenAddress: string) {
    const info = this.tokenInfo.get(tokenAddress)
    if (info) {
      info.balance = await info.contract.balanceOf(this.accountAddress)
      this.emit('balanceUpdated', tokenAddress, info.balance)
    }
  }

  setBalance(tokenAddress: string, getBalance: (currentBalance: BigNumber) => BigNumber): void {
    const info = this.tokenInfo.get(tokenAddress)
    if (info) {
      info.balance = getBalance(info.balance)
      this.emit('balanceUpdated', tokenAddress, info.balance)
    }
  }
}
