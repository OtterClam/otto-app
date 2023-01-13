import { Erc20__factory } from 'contracts/__generated__'
import { Erc20, TransferEventFilter } from 'contracts/__generated__/Erc20'
import { BigNumber, ethers, providers } from 'ethers'
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
  transferEventListener: providers.Listener
}

export default class Wallet extends EventEmitter {
  private tokenInfo = new Map<string, TokenInfo>()

  private ethersProvider: providers.Provider

  private accountAddress: string

  constructor(options: WalletOptions) {
    super()
    this.ethersProvider = options.ethersProvider
    this.accountAddress = options.accountAddress
    this.setMaxListeners(Infinity)
  }

  private fireBalanceUpdatedEvent(tokenAddress: string, balance: BigNumber): void {
    this.emit('balanceUpdated', tokenAddress, balance)
  }

  destroy() {
    Array.from(this.tokenInfo).forEach(([, info]) => {
      const eventFilters = this.getTokenTransferEventFilters(info.contract)
      eventFilters.forEach(eventFilter => {
        this.ethersProvider.off(eventFilter, info.transferEventListener)
      })
    })
  }

  private getTokenTransferEventFilters(token: Erc20): TransferEventFilter[] {
    return [token.filters.Transfer(null, this.accountAddress), token.filters.Transfer(this.accountAddress, null)]
  }

  async trackTokenBalance(tokenAddress: string): Promise<void> {
    if (this.tokenInfo.has(tokenAddress)) {
      return
    }

    const contract = Erc20__factory.connect(tokenAddress, this.ethersProvider)
    const [decimals, balance] = await Promise.all([contract.decimals(), contract.balanceOf(this.accountAddress)])

    const info: TokenInfo = {
      balance,
      decimals,
      contract,
      transferEventListener: debounce(this.handleTokenTransferEvent.bind(this, tokenAddress), 500),
    }

    this.tokenInfo.set(tokenAddress, info)

    const eventFilters = this.getTokenTransferEventFilters(info.contract)
    eventFilters.forEach(eventFilter => {
      this.ethersProvider.on(eventFilter, this.handleTokenTransferEvent)
    })

    this.fireBalanceUpdatedEvent(tokenAddress, info.balance)
  }

  handleTokenTransferEvent = async (tokenAddress: string) => {
    const info = this.tokenInfo.get(tokenAddress)
    if (info) {
      info.balance = await info.contract.balanceOf(this.accountAddress)
      this.fireBalanceUpdatedEvent(tokenAddress, info.balance)
    }
  }

  setBalance(tokenAddress: string, getBalance: (currentBalance: BigNumber) => BigNumber): void {
    const info = this.tokenInfo.get(tokenAddress)
    if (info) {
      info.balance = getBalance(info.balance)
      this.fireBalanceUpdatedEvent(tokenAddress, info.balance)
    }
  }

  getBalance(tokenAddress: string): BigNumber {
    return this.tokenInfo.get(tokenAddress)?.balance ?? BigNumber.from(0)
  }
}
