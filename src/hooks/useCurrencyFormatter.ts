import { Currency, useCurrency } from 'contexts/Currency'
import { BigNumberish } from 'ethers'

type Formatter = (num?: BigNumberish) => string

export default function useCurrencyFormatter({
  formatters,
  defaultCurrency = Currency.CLAM,
}: {
  formatters: {
    [k: number]: Formatter
  }
  defaultCurrency: Currency
}): Formatter {
  const { currency } = useCurrency()
  return formatters[currency] ?? formatters[defaultCurrency]
}
